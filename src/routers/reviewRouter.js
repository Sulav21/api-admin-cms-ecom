import express from 'express'
const router = express.Router()
import {reviewdata} from '../fake-db/fakeReview.js'


// fake data that need to be updated when frontend is comnpleted
router.get('/:_id?', (req,res,next)=>{
    try{
       const {_id} = req.params
       const data = _id ? reviewdata.filter(item=>item._id === _id) :reviewdata
        res.json({
            status:'success',
            message:'Reviews result',
            review:data
        })

    }catch(error){
        next(error)
    }
})




export default router
