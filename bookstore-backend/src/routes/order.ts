import express from "express";
import { createOrder,getMerchantOrders,getMyOrders } from "../controllers/orderController";

import { auth } from '../middleware/auth';

const router = express.Router();

router.post("/", auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get("/merchant",auth,getMerchantOrders)
export default router;
 