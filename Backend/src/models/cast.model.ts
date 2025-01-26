import mongoose, { Document, Schema } from 'mongoose';

export interface ICast extends Document {
  name: string;
  description: string;
  religionId: mongoose.Types.ObjectId; // Reference to Religion schema
}

const castSchema = new Schema<ICast>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  religionId: {
    type: Schema.Types.ObjectId,
    ref: 'Religion', // Reference to the Religion model
    required: [true, 'Religion ID is required'],
  },
});

export const Cast = mongoose.model<ICast>('Cast', castSchema);
