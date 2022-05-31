import Joi from "joi";

export const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: Joi.string().alphanum().required().min(3).max(20),
    lName: Joi.string().required().min(3).max(20),
    email: Joi.string().email({minDomainSegments:2}).required(),
    phone: Joi.string().required().min(9).max(15),
    dob: Joi.date().allow(null),
    address: Joi.string().allow(null).allow(''),
    password: Joi.string().required(),

  });

 const {value,error}= schema.validate(req.body)
console.log(error?.message)

 if(error){
     res.json({
         status:'error',
         message:error.message
     })
 }

next()

};

export const emailVerficationValidation = (req,res,next)=>{
  const schema = Joi.object({
    email: Joi.string().email({minDomainSegments:2}).required(),
    emailValidationCode:Joi.string().required()
  })

  const {err} = schema.validate(req.body)
  if(err){
    res.json({
        status:'error',
        message:err.message
    })
}

next()
}