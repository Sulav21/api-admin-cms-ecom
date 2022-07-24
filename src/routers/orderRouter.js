import express from 'express'
const router = express.Router()
import {orderData} from '../fake-db/fakeOrder.js'


// fake data that need to be updated when frontend is comnpleted
router.get('/:_id?', (req,res,next)=>{
    try{
       const {_id} = req.params
       const data = _id ? orderData.filter(item=>item._id === _id) :orderData
        res.json({
            status:'success',
            message:'Reviews result',
            orders:data
        })

    }catch(error){
        next(error)
    }
})




export default router
