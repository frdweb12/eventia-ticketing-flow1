
import { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new booking
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { event_id, seats, total_amount, final_amount } = req.body;

    // Validate required fields
    if (!event_id || !seats || !total_amount || !final_amount) {
      throw ApiError.badRequest('Missing required booking information');
    }

    // Generate a unique booking ID
    const booking_id = uuidv4();

    // Create the booking
    const [newBooking] = await db('bookings').insert({
      id: booking_id,
      event_id,
      seats,
      total_amount,
      final_amount,
      status: 'pending',
    }).returning('*');

    return res.status(201).json({
      status: 'success',
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate booking ID
    if (!id) {
      throw ApiError.badRequest('Booking ID is required');
    }

    // Get booking details
    const booking = await db('bookings')
      .select('*')
      .where('id', id)
      .first();

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    return res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

/**
 * Save delivery details
 */
export const saveDeliveryDetails = async (req: Request, res: Response) => {
  try {
    const { booking_id, name, phone, address, city, pincode } = req.body;

    // Validate required fields
    if (!booking_id || !name || !phone || !address || !city || !pincode) {
      throw ApiError.badRequest('Missing required delivery details');
    }

    // Check if booking exists
    const booking = await db('bookings')
      .select('id')
      .where('id', booking_id)
      .first();

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Save delivery details
    const [deliveryDetails] = await db('delivery_details').insert({
      booking_id,
      name,
      phone,
      address,
      city,
      pincode
    }).returning('*');

    return res.status(201).json({
      status: 'success',
      data: deliveryDetails
    });
  } catch (error) {
    console.error('Error saving delivery details:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!id || !status) {
      throw ApiError.badRequest('Booking ID and status are required');
    }

    // Check if booking exists
    const booking = await db('bookings')
      .select('id')
      .where('id', id)
      .first();

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Update booking status
    const [updatedBooking] = await db('bookings')
      .where('id', id)
      .update({ status })
      .returning('*');

    return res.status(200).json({
      status: 'success',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
