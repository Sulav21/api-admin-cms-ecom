import 'dotenv/config'
import express from 'express'
const app = express()
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'

const PORT = process.env.PORT || 8000

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
import { adminAuth } from './src/middlewares/auth-middlewares/authMiddlewares.js'


// serve static content
const _dirname = path.resolve()
app.use(express.static(path.join(_dirname,"public")))


// mongo db connection
import { dbconnect } from './src/config/db.js'
dbconnect()

// routers
import adminRouter from './src/routers/adminRouter.js'
app.use('/api/v1/admin',adminRouter)

import productRouter from './src/routers/productRouter.js'
app.use('/api/v1/products',adminAuth,productRouter)

import categoryRouter from './src/routers/categoryRouter.js'
app.use('/api/v1/category', adminAuth , categoryRouter)

import paymentMethodRouter from './src/routers/paymentRouter/paymentMethodRouter.js'
app.use('/api/v1/payment-method',adminAuth, paymentMethodRouter)


app.get('/',(req,res)=>{
    res.json({
        message:"You have reached the admin API"
    })
})


// global error handling

app.use((err,req,res,next)=>{
console.log(err)
    res.status(err.status || 404)
    res.json({
        status:'error',
        message:err.message
    })
})

// bound app with the port to serve on internet
app.listen(PORT, ERROR=>{
    ERROR && console.log(ERROR)

console.log(`Your server is running on PORT: ${PORT}`)

})