import express from 'express'
import slugify from 'slugify'
import { newProductValidation } from '../middlewares/joi-validation/productCatValidation.js'
import { insertProduct } from '../models/product/Product.model.js'
const router = express.Router()

router.post('/',newProductValidation, async(req,res,next)=>{
    try{
    console.log(req.body)
    const {name} = req.body
    const slug = slugify(name,{lower:true,trim:true})
    req.body.slug = slug
    const result = await insertProduct(req.body)
    result?._id ? 
    res.json({
        status:'success',
        message:'New product added'
    }):
    res.json({
        status:'error',
        message:'Error ! Unable to create new product'
    })

    }catch(error){
        if(error.message.includes('E11000 duplicate key error collection')){
            error.message="Another product with similar name or SKU already exists"
            error.status = 200
        }
        next(error)
    }
})










export default router