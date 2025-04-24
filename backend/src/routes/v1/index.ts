
import { Router } from 'express';
import authRoutes from '../auth';
import userRoutes from '../user.routes';
import eventRoutes from '../event.routes';
import bookingRoutes from '../booking.routes';
import paymentRoutes from '../payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export default router;
