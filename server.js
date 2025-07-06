import express from 'express';
import connectDB from './src/config/mongodb.js';
import dotenv from 'dotenv';
import connectCloudinary from './src/utils/cloudinary.js';
import cors from 'cors';
import userRouter from './src/routes/userRoutes.js';
import productRouter from './src/routes/productRoutes.js';
import cartRouter from './src/routes/cartRoutes.js';
import orderRouter from './src/routes/orderRoutes.js';``

dotenv.config({ path: './.env' }); // Ensure the path to .env is correct

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Replace with specific frontend domain if necessary
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/', (req, res) => {
  res.send({
    success: true,
    error: false,
    message: 'Server is running',});
})

// Connect to DB and start the server
connectDB()
  .then(() => {
    app.get('/', (req, res) => {
      res.send('DB connected and routes set up');
    });

    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Connection Error in server.js: ${error.message}`);
  });

// Connect to Cloudinary
connectCloudinary();

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});
