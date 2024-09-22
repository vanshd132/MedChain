import express from 'express';
import paymentController from '../controllers/vansh/paymentController.js';

const paymentRouter = express.Router();
paymentRouter.post('/create-checkout-session',paymentController.createCheckOutSession);
paymentRouter.get('/session-status',paymentController.sessionStatus);

export default paymentRouter;