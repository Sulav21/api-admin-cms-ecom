import Joi from "joi";
import { LONGSTR,SHORTSTR,QUANTITY, PRICE, DATE,validator } from "./constantValidation.js";

export const newCategoryValidation =(req,res,next)=>{

    try{
        const schema = Joi.object({
            _id:SHORTSTR.allow(''),
            parentCatId:SHORTSTR.allow(null,''),
            catName: SHORTSTR.required(),
            status: SHORTSTR.required()
        })
        validator(schema,req,res,next)
    }catch(error){
        next(error)
    }
}


export const newProductValidation =(req,res,next)=>{

    try{
        const schema = Joi.object({
            _id:SHORTSTR.allow(''),
            status: SHORTSTR,
            name:SHORTSTR.required(),
            sku:SHORTSTR.required(),
            description:LONGSTR.required(),
            qty:QUANTITY.required(),
            price: PRICE.required(),
            salesPrice: PRICE,
            salesDate: DATE.allow(null),



        })
        validator(schema,req,res,next)
    }catch(error){
        next(error)
    }
}
