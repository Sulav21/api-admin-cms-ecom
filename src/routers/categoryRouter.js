import express from 'express'
import { newCategoryValidation } from '../middlewares/joi-validation/productCatValidation.js'
import { deleteCatByID, getAllCategories, getCategories, insertCategory,updateCatById } from '../models/category/Category.models.js'
import slugify from 'slugify'
const router = express.Router()

// add new category
router.post("/",newCategoryValidation ,async(req,res,next)=>{
    try{
        console.log(req.body)
        const slug = slugify(req.body.catName,{lower:true,trim:true})
        console.log(slug)
        const result = await insertCategory({...req.body,slug})
console.log(result)
        result?._id ?
        res.json({
            status:'success',
            message:"New category has been added"
        })
        :
        res.json({
            status:'error',
            message:"Unable to add category, please try again later"
        })
    }catch(error){
        console.log(error)
        error.status = 500
        if(error.message.includes("E11000 duplicate key")){
            error.status = 200
            error.message = 'This category already exists, please change the category name'
        }
        next(error)
    }
})

// get all category
router.get('/', async(req,res,next)=>{
    try{
        const filter = {status:'active'}
        const result = await getAllCategories(filter)
        res.json({
            status:'success',
            message:'Categories result',
            result
        })

    }catch(error){
        next(error)
    }
})

// uopdate category status
router.patch('/', async(req,res,next)=>{
    try{
        const {_id,status} = req.body
       if(!_id || !status){
        
            throw new Error("Invalid data set")
        
       }
       const result = await updateCatById(_id,{status})
       result?._id 
       ?
        res.json({
            status:'success',
            message:'Status Updated',
            result
        })
        :
        res.json({
            status:'error',
            message:'Uanble to update, try again later',
            result
        })


    }catch(error){
        next(error)
    }
})

router.delete('/',async(req,res,next)=>{
try{
const {_id} = req.body
const filter = {parentCatId:_id}
const childCats = await getCategories(filter)
if(childCats.length){
    return res.json({
        status:'error',
        message:"Cannot delete as some child categories depend on this category, please reallocate those to new parent and try again"
    })
}
const result = await deleteCatByID(_id)
result?._id ?

res.json({
    status:'success',
    message:'The category has been deleted'
}):
res.json({
    status:'error',
    message:'Unable to delete, try again later'
})
}catch(error){
    next(error)
}
})

// update category
router.put("/",newCategoryValidation ,async(req,res,next)=>{
    try{
        const {_id,...rest} = req.body

        // const slug = slugify(req.body.catName,{lower:true,trim:true})
        // console.log(slug)
        const result = await updateCatById(_id,rest)
console.log(result)
        result?._id ?
        res.json({
            status:'success',
            message:"Category has been updated"
        })
        :
        res.json({
            status:'error',
            message:"Unable to update category, please try again later"
        })
    }catch(error){
        next(error)
    }
})


export default router
