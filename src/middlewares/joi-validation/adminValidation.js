import Joi from "joi";
import {FNAME,LNAME,EMAIL,PHONE,DOB,ADDRESS,PASSWORD,REQUIREDSTR, validator, SHORTSTR} from './constantValidation.js'
// const fName= Joi.string().alphanum().required().min(3).max(20)
// const lName= Joi.string().required().min(3).max(20)
// const email= Joi.string().email({minDomainSegments:2}).required()
// const phone= Joi.string().required().min(9).max(15)
// const dob= Joi.date().allow(null)
// const address= Joi.string().allow(null).allow('')
// const password= Joi.string().required()
// const requiredStr=Joi.string().required()

export const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fName:FNAME,
    lName:LNAME,
    email:EMAIL,
    phone:PHONE,
    dob:DOB,
    address:ADDRESS,
    password:PASSWORD,

  });

 
    validator(schema,req,res,next)

};

export const updateAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR,
    fName:FNAME,
    lName:LNAME,
    email:EMAIL,
    phone:PHONE,
    dob:DOB,
    address:ADDRESS,
    password:PASSWORD,

  });

 
    validator(schema,req,res,next)

};


export const emailVerficationValidation = (req,res,next)=>{
  const schema = Joi.object({
    email:EMAIL,
    emailValidationCode:REQUIREDSTR,
  })

  validator(schema,req,res,next)
}

export const loginValidation =(req,res,next)=>{
  const schema = Joi.object({
    email:EMAIL,
   password:PASSWORD,
  })

  validator(schema,req,res,next)
}

export const updatePasswordValidation =(req,res,next)=>{
  const schema = Joi.object({
    email:EMAIL,
   password:PASSWORD,
   currentPassword:PASSWORD,
  })

  validator(schema,req,res,next)
}