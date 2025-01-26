import { Request, Response, NextFunction } from 'express';
import { Religion } from '../models/religion.model';
import { Cast } from '../models/cast.model';


// Create a new Cast
const createCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, religionId } = req.body;

    // Validate that the religionId exists in the Religion collection
    const religion = await Religion.findById(religionId);
    if (!religion) {
      res.status(404).json({ message: 'Religion not found' });
      return;
    }

    const cast = new Cast({ name, description, religionId });
    const newCast = await cast.save();

    res.status(201).json({ message: 'Cast created successfully', data: newCast });
  } catch (err:any) {
    res.status(500).json({ message: 'Error creating cast', error: err.message });
  }
};

// Get all Casts
const getCasts = async (req: Request, res: Response): Promise<void> => {
  try {
    const casts = await Cast.find().populate('religionId', 'name description'); // Populate religion details
    res.status(200).json(casts);
  } catch (err:any) {
    res.status(500).json({ message: 'Error fetching casts', error: err.message });
  }
};

// Get Cast by ID
const getCastById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cast = await Cast.findById(req.params.id).populate('religionId', 'name description');
    if (!cast) {
      res.status(404).json({ message: 'Cast not found' });
      return;
    }
    res.status(200).json(cast);
  } catch (err:any) {
    res.status(500).json({ message: 'Error fetching cast', error: err.message });
  }
};

// Update a Cast
const updateCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const { religionId } = req.body;

    // If religionId is provided, validate it
    if (religionId) {
      const religion = await Religion.findById(religionId);
      if (!religion) {
        res.status(404).json({ message: 'Religion not found' });
        return;
      }
    }

    const cast = await Cast.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cast) {
      res.status(404).json({ message: 'Cast not found' });
      return;
    }

    res.status(200).json({ message: 'Cast updated successfully', data: cast });
  } catch (err:any) {
    res.status(500).json({ message: 'Error updating cast', error: err.message });
  }
};

// Delete a Cast
const deleteCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const cast = await Cast.findByIdAndDelete(req.params.id);
    if (!cast) {
      res.status(404).json({ message: 'Cast not found' });
      return;
    }
    res.status(200).json({ message: 'Cast deleted successfully', data: cast });
  } catch (err:any) {
    res.status(500).json({ message: 'Error deleting cast', error: err.message });
  }
};

export const castController = {
  createCast,
  getCasts,
  getCastById,
  updateCast,
  deleteCast,
};
