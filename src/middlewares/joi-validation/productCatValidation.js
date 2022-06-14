import Joi from "joi";
import { LONGSTR,SHORTSTR, validator } from "./constantValidation.js";

export const newCategoryValidation =(req,res,next)=>{

    try{
        const schema = Joi.object({
            parentCatId:SHORTSTR.allow(''),
            catName: SHORTSTR.required(),
            status: SHORTSTR.required()
        })
        validator(schema,req,res,next)
    }catch(error){
        next(error)
    }
}

