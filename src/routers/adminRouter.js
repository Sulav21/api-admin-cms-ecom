import express from "express";
import { encryptPassword } from "../../helpers/bcryptHelper.js";
import { emailVerficationValidation, newAdminValidation } from "../middlewares/joi-validation/adminValidation.js";
import { insertAdmin,updateAdmin } from "../models/admin/Admin.models.js";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helpers/emailHelper.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET got hit to admin router",
  });
});

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
        const URL = `${process.env.ROOT_URL}/admin/verify-email/?c=${result.emailValidationCode}&e=${result.email}`
        // send email to the user
        
        sendMail({fName:result.fName,URL})

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

router.post('/email-verification',emailVerficationValidation,async(req,res)=>{
    console.log(req.body)
    const filter = req.body
    const update = {status:'active'}

    const result = await updateAdmin(filter,update)
    console.log(result)

    result?._id ? 
    res.json({
        status:'success',
        message:'Email verified successfully, you may login now'
    })

    : res.json({
        status:'error',
        message:'Invalid or expired verification link'
    })
})

router.patch("/", (req, res) => {
  res.json({
    status: "success",
    message: "PATCH got hit to admin router",
  });
});

export default router;