import { Request, Response, NextFunction } from 'express';
import { Religion } from '../models/religion.model';

const createReligion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, isActive, photo } = req.body;

    if (!name || !description || typeof isActive !== 'boolean') {
      res.status(400).json({ message: 'Invalid data. Name, description, and isActive are required.' });
      return;
    }

    const religion = new Religion({ name, description, photo, isActive });
    const newReligion = await religion.save();
    res.status(201).json({ message: 'Religion created successfully', data: newReligion });
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating religion', error: err.message });
  }
};

const getReligions = async (req: Request, res: Response): Promise<void> => {
  try {
    const religions = await Religion.find();
    res.status(200).json(religions);
  } catch (err:any) {
    res.status(500).json({ message: 'Error fetching religions', error: err.message });
  }
};

const getReligionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const religion = await Religion.findById(req.params.id);

    if (!religion) {
      res.status(404).json({ message: 'Religion not found' });
      return;
    }

    res.status(200).json(religion);
  } catch (err) {
    next(err);
  }
};

const updateReligion = async (req: Request, res: Response): Promise<void> => {
  try {
    const religion = await Religion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!religion) {
      res.status(404).json({ message: 'Religion not found' });
      return;
    }

    res.status(200).json({ message: 'Religion updated successfully', data: religion });
  } catch (err:any) {
    res.status(500).json({ message: 'Error updating religion', error: err.message });
  }
};

const deleteReligion = async (req: Request, res: Response): Promise<void> => {
  try {
    const religion = await Religion.findByIdAndDelete(req.params.id);

    if (!religion) {
      res.status(404).json({ message: 'Religion not found' });
      return;
    }

    res.status(200).json({ message: 'Religion deleted successfully', data: religion });
  } catch (err:any) {
    res.status(500).json({ message: 'Error deleting religion', error: err.message });
  }
};

export const religionController = {
  createReligion,
  getReligions,
  getReligionById,
  updateReligion,
  deleteReligion,
};
