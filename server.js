import 'dotenv/config'
import express from 'express'
const app = express()
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

const PORT = process.env.PORT || 8000

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())

// mongo db connection


// routers
app.get('/',(req,res)=>{
    res.json({
        message:"You have reached the admin API"
    })
})


// global error handling

app.use((err,req,res,next)=>{
    console.log(err)
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