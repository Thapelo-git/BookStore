import { Request, Response } from 'express';
import Address from '../models/address';
import { AuthRequest } from '../types/book';
// Create address
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const address = await Address.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json({
      success: true,
      data: address,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create address',
    });
  }
};

// Get user addresses
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId });

    res.json({
      success: true,
      data: addresses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
    });
  }
};

// Update address
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: address,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
    });
  }
};

// Delete address
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    await Address.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Address deleted',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
    });
  }
};