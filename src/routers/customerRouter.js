import express from 'express'
import { getCustomers } from '../fake-db/fakeDB.js'
const router = express.Router()


// fake data that need to be updated when frontend is comnpleted
router.get('/:_id?', async(req,res,next)=>{
    try{
        const {_id} = req.params
       
       const {data} = await getCustomers(_id)
        res.json({
            status:'success',
            message:'Customers result',
            customers:data
        })

    }catch(error){
        next(error)
    }
})




export default router
