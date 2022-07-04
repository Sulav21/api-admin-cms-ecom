import Joi from "joi";
import {LONGSTR, SHORTSTR, validator} from './constantValidation.js'

export const newPaymentMethod = (req, res, next) => {
  const schema = Joi.object({
    status:SHORTSTR.required(),
    _id:SHORTSTR.allow(null,""),
    name:SHORTSTR.required(),
    description:LONGSTR.required(),
  });

 
    validator(schema,req,res,next)

};
