import mongoose, { Schema, Document } from 'mongoose';
import { AddressDocument } from '../types/book';



const AddressSchema = new Schema<AddressDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    label: {
      type: String,
      required: true,
      maxlength: 50,
    },

    street: {
      type: String,
      required: true,
      maxlength: 200,
    },

    city: {
      type: String,
      required: true,
      maxlength: 100,
    },

    state: {
      type: String,
      maxlength: 100,
    },

    zipCode: {
      type: String,
      maxlength: 20,
    },

    country: {
      type: String,
      required: true,
      maxlength: 100,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AddressDocument>('Address', AddressSchema);