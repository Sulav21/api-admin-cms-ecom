import express from 'express'
const router = express.Router()

// add new payment method
router.post("/",async(req,res,next)=>{
    try{
       console.log(req.body)
       res.json({
        status:"success",
        message:'Payment method has been added'
       })
    }catch(error){

        next(error)
    }
})

// Update Payment Method
router.patch("/",async(req,res,next)=>{
    try{
       console.log(req.body)
       res.json({
        status:"success",
        message:'Payment Method has been updated'
       })
    }catch(error){

        next(error)
    }
})


// get all category
router.get('/', async(req,res,next)=>{
    try{
        // const filter = {status:'active'}
        // const result = await getAllCategories(filter)
        res.json({
            status:'success',
            message:'Payment Methods result',
            // result
        })

    }catch(error){
        next(error)
    }
})

router.delete('/:_id',async(req,res,next)=>{
try{
    const{_id} = req.params
    console.log(_id)

    }catch(error){
        next(error)
    }
})


export default router
