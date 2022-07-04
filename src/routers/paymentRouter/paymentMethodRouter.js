import express from 'express'
const router = express.Router()
import {newPaymentMethod} from '../../middlewares/joi-validation/paymentValidation.js'
import { deletePaymentMethodByID, getAPaymentMethod,getAllPaymentMethod, insertPaymentMethod, updatePaymentMethodById } from '../../models/payment-methods/PaymentMethod.models.js'


// get all payment method
router.get('/:_id?', async(req,res,next)=>{
    try{
        const {_id} = req.params
       
        const result =_id ? await getAPaymentMethod({_id}) :await getAllPaymentMethod()
        res.json({
            status:'success',
            message:'Payment Methods result',
            result
        })

    }catch(error){
        next(error)
    }
})

// add new payment method
router.post("/",newPaymentMethod,async(req,res,next)=>{
    try{
       console.log(req.body)
       const result = await insertPaymentMethod(req.body)
       result?._id ?
       res.json({
        status:"success",
        message:'Payment method has been added'
       }) : res.json({
        status:"error",
        message:'Unable to add payment method, please try again later'
       })
    }catch(error){
        err.status = 500;

    if (err.message.includes("E11000 duplicate key")) {
      err.message = "Email already exists";
      err.status = 200;
    }

        next(error)
    }
})

// Update Payment Method
router.put("/",newPaymentMethod, async(req,res,next)=>{
    try{
       console.log(req.body)
       const {_id,...rest}=req.body
       if(typeof _id === 'string') {
        const result = await updatePaymentMethodById(_id,rest)
        if(result?._id){
            return res.json({
                status:"success",
                message:'Payment Method has been updated'
               })
        }
       }
       res.json({
        status:"error",
        message:"There was an error while updating the payment method, please try again later"
       })
       
    }catch(error){

        next(error)
    }
})


router.delete('/:_id',async(req,res,next)=>{
try{
    const{_id} = req.params
    console.log(_id)
const result  = await deletePaymentMethodByID(_id)
result?._id ?

res.json({
    status:'success',
    message:'The payment method has been deleted'
}):
res.json({
    status:'error',
    message:'Unable to delete, try again later'
})
    }catch(error){
        next(error)
    }
})


export default router
