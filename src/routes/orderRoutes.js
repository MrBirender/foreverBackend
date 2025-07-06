import express from "express";
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrder, updateStatus , verifyStripePayment, verifyRazorpayPayment} from "../controllers/order.controller.js";
import adminAuth from "../middelwares/adminAuth.js";
import authUser from "../middelwares/auth.js";

const orderRouter = express.Router();

/* admin routes */
orderRouter.post('/list', adminAuth,  allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

/* payment features */
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

/* user features */
orderRouter.post('/userorders', authUser, userOrder)

/* verify stripe payment   */
orderRouter.post('/verifystripe', authUser, verifyStripePayment)
orderRouter.post('/verifyrazorpay', authUser, verifyRazorpayPayment)	

/* check when to use get, post and put and when i am getting data from server and sending data for authentication then
should i use post or get method. */

export default orderRouter