import express from "express";
import { encryptPassword, verifyPassword } from "../helpers/bcryptHelper.js";
import {
  emailVerficationValidation,
  loginValidation,
  updateAdminValidation,
  updatePasswordValidation,
  newAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import {
  getAdmin,
  getAdminById,
  insertAdmin,
  updateAdmin,
} from "../models/admin/Admin.models.js";
import { v4 as uuidv4 } from "uuid";
import {
  sendMail,
  otpNotification,
  profileUpdateNotification,
} from "../helpers/emailHelper.js";
import { createOtp } from "../helpers/randomGenerator.js";
import {
  deleteSession,
  getSession,
  insertSession,
} from "../models/session/sessionModel.js";
import { createJWTs, signAccessJwt, verifyRefreshJwt } from "../helpers/jwtHelper.js";
import { adminAuth } from "../middlewares/auth-middlewares/authMiddlewares.js";
const router = express.Router();

router.get("/",adminAuth, (req, res) => {
  try{

    let user = req.adminInfo
    
    user.password = undefined
    user.refreshJWT = undefined
    res.json({
      status: "success",
      message: "GET got hit to admin router",
      user
    });
  }catch(err){
    next(err)
  }
 
});

// New admin registration
router.post("/", adminAuth, newAdminValidation, async (req, res, next) => {
  try {
    const hashPassword = encryptPassword(req.body.password);
    req.body.password = hashPassword;

    // create unique email validation code
    req.body.emailValidationCode = uuidv4();

    const result = await insertAdmin(req.body);
    console.log(result);

    if (result?._id) {
      // create uniqueURL and send it to the user email
      const URL = `${process.env.ROOT_URL}/admin/verify-email/?c=${result.emailValidationCode}&e=${result.email}`;
      // send email to the user

      sendMail({ fName: result.fName, URL });

      res.json({
        status: "success",
        message: "New admin created successfully",
      });
    } else {
      res.json({
        status: "error",
        message: "Unable create new admin, contact admin support team",
      });
    }
  } catch (err) {
    err.status = 500;

    if (err.message.includes("E11000 duplicate key")) {
      err.message = "Email already exists";
      err.status = 200;
    }

    next(err);
  }
});

// Email verification router
router.post(
  "/email-verification",
  emailVerficationValidation,
  async (req, res) => {
    console.log(req.body);
    const filter = req.body;
    const update = { status: "active" };

    const result = await updateAdmin(filter, update);
    console.log(result);

    if (result?._id) {
      res.json({
        status: "success",
        message: "Email verified successfully, you may login now",
      });

      await updateAdmin(filter, { emailValidationCode: "" });
      return;
    }

    res.json({
      status: "error",
      message: "Invalid or expired verification link",
    });
  }
);

// login user with user and password
// this feature isnot completed yet
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    // query get user by email

    const user = await getAdmin({ email });
    if (user?.id) {
      if (user.status === "inactive")
        return res.json({
          status: "error",
          message:
            "Your account isnot active yet, please check your email and follow the instructions",
        });
      console.log(user);
      // if user exist compare password,
      const isMatched = verifyPassword(password, user.password);
      if (isMatched) {
        user.password = undefined;
        // for now
        const jwts = await createJWTs({ email: user.email });
        res.json({
          status: "success",
          message: "Successful login",
          user,
          jwts,
        });
        return;
      }

      // if match, process for creating JWT
      // for now, send login access to the user
    }

    // check for the authentication

    res.status(401).json({
      status: "error",
      message: "Invalid login credentials",
    });
    // check for authentication
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Update Admin Profile
router.put("/",adminAuth, updateAdminValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const user = await getAdmin({ email });

    if (user?._id) {
      const isMatched = verifyPassword(password, user.password);
      if (isMatched) {
        // update user
        const { _id, password, ...rest } = req.body;
        const updatedAdmin = await updateAdmin({ _id }, rest);
        if (updatedAdmin?._id) {
          // send email notification saying profile is updated
          return res.json({
            status: "success",
            message: "Admin profile updated succesfully",
            user: updatedAdmin,
          });
        }
      }
    }
    res.json({
      status: "error",
      message: "Invalid request, your profile didn't got updated ",
    });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

// Password reset OTP request
router.post("/otp-request", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      // check if user exists
      const user = await getAdmin({ email });
      if (user?._id) {
        // create OTP and send email
        const obj = {
          token: createOtp(),
          associate: email,
          type: "Password reset",
        };
        const result = await insertSession(obj);
        if (result?._id) {
          console.log(result);
          res.json({
            status: "success",
            message: "Please check your email for a OTP",
          });
        }

        // send the OTP to admin email
        return otpNotification({
          token: result.token,
          email: email,
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid request",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// reset password

router.patch("/password", async (req, res, next) => {
  try {
    const { otp, email, password } = req.body;
    console.log(req.body);

    // 1. get session info based on the otp, so that we get the use email
    const session = await deleteSession({ token: otp, associate: email });

    console.log(session);
    if (session?._id) {
      const update = {
        password: encryptPassword(password),
      };
      const updatedUser = await updateAdmin({ email }, update);
      if (updatedUser?._id) {
        // send the email notification
        profileUpdateNotification({
          fName: updatedUser.fName,
          email: updatedUser.email,
        });
        return res.json({
          status: "success",
          message: "Your password has been updated",
          user: updatedUser,
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid request, unable to update the password",
    });
    // 2.
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// update password
router.patch(
  "/update-password",adminAuth,
  updatePasswordValidation,
  async (req, res, next) => {
    try {
      const { currentPassword, email, password } = req.body;
      console.log(req.body);
      const user = await getAdmin({ email });

      if (user?._id) {
        const isMatched = verifyPassword(currentPassword, user.password);
        if (isMatched) {
          const hashPassword = encryptPassword(password);
          const updatedUser = await updateAdmin(
            {
              _id: user._id,
            },
            {
              password: hashPassword,
            }
          );
          if (updatedUser?._id) {
            profileUpdateNotification({
              fName: updatedUser.fname,
              email: updatedUser.email,
            });
            return res.json({
              status: "success",
              message: "Password has been updated successfully",
            });
          }
        }
      }
      res.json({
        status: "error",
        message: "Unable to update the password",
      });
    } catch (error) {
      error.status = 500;
      next(error);
    }
  }
);

// this will return new accessjwt
router.get("/accessjwt", async(req, res, next) => {
  try {
    const refreshJWT = req.headers.authorization;
    console.log(refreshJWT);
    const decoded =verifyRefreshJwt(refreshJWT)
    if(decoded?.email){
    // check refJWT valid and exist in db
      const user = await getAdmin({email:decoded.email,refreshJWT})
      if(user._id){
        // create token and return to the client
        const accessJWT = await signAccessJwt({email:decoded.email})
        res.json({
          status:"success",
         accessJWT
        })
      }
    
    }
    res.status(401).json({
      status:"error",
      message:'Log out user'
    })
  } catch (error) {
    error.status=401
    next(error);
  }
});

export default router;
