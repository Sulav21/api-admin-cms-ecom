import express from "express";
import { encryptPassword, verifyPassword } from "../../helpers/bcryptHelper.js";
import {
  emailVerficationValidation,
  loginValidation,
  updateAdminValidation,
  newAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import {
  getAdmin,
  insertAdmin,
  updateAdmin,
} from "../models/admin/Admin.models.js";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helpers/emailHelper.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET got hit to admin router",
  });
});

// New admin registration
router.post("/", newAdminValidation, async (req, res, next) => {
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
        res.json({
          status: "success",
          message: "Successful login",
          user,
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
router.put("/", updateAdminValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const user = await getAdmin({ email });

    if (user?._id) {
      const isMatched = verifyPassword(password, user.password);
      if (isMatched) {
        // update user
        const { _id,password, ...rest } = req.body;
        const updatedAdmin = await updateAdmin({ _id }, rest);
        if (updatedAdmin?._id) {
          // send email notification saying profile is updated
          return res.json({
            status: "success",
            message: "Admin profile updated succesfully",
            user:updatedAdmin,
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

export default router;
