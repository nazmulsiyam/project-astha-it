import mongoose, { Document, Schema } from 'mongoose';

export interface IReligion extends Document {
  name: string;
  description: string;
  photo?: string;
  isActive: boolean;
}

const religionSchema = new Schema<IReligion>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  photo: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: [true, 'isActive field is required'],
  },
});

export const Religion = mongoose.model<IReligion>('Religion', religionSchema);
