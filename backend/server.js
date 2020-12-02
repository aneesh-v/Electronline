
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import morgan from 'morgan'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import uploadRouter from './routes/uploadRoutes.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

dotenv.config()

connectDB();

const app = express();

if(process.env.NODE_ENV === 'Development'){
    app.use(morgan('dev'))
}


// To allow json data in the body
app.use(express.json())


app.get('/' , (req, res) =>{
    res.send("API running...");
})

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRouter)

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))


// this is because __dirname is only available in commonJs module. It is not avilable in ES modules
// to mimic this we use resolve().
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use(notFound)

app.use(errorHandler)



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));
