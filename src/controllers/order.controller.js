import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

/* global variabels */
const deliveryCharge = 10;
const currency = "inr";

/* intialize stripe */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* intialize razorpay */
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

/* place order for cod */
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* place order using stripe */
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    /* origin = website url */
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    /* line items for stripe */
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    /* sessions */
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* verify stripe payment */
const verifyStripePayment = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successfull" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* place order using razorpay */
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: new Date(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: "INR",	
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Error:", error); // Log Razorpay error
        return res.status(500).json({ success: false, message: error.message });
      }

      res.json({ success: true, order });
    });
  } catch (error) {
    console.error("Server Error:", error); // Log server-side error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* verify razorpay payment */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if(orderInfo.status === "paid"){
      await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successfull" });
    }else{
      res.json({ success: false, message: "Payment Failed" });
    }
    
}catch (error) {
    console.error("Server Error:", error); // Log server-side error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* show all order on admin panel */
const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* show orders for user in particular */
const userOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* update order status */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrder,
  updateStatus,
  verifyStripePayment,
  verifyRazorpayPayment
};
