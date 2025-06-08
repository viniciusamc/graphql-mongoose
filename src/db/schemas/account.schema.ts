import mongoose from 'mongoose';
import { KeyTypesEnum } from '../../utils/enum/key-types';
import { KeyReason } from '../../utils/enum/key-reason';

const accountSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true },
    key: { type: String, required: true, unique: true },
    keyType: { type: String, enum: KeyTypesEnum, required: true },
    account: {
      branch: { type: String, required: true },
      accountNumber: { type: String, required: true },
      accountType: { type: String, required: true },
      openingDate: { type: Date, required: true },
    },
    owner: {
      type: { type: String, required: true },
      taxIdNumber: { type: String, required: false },
      name: { type: String, required: true },
    },
    creationDate: { type: Date, default: Date.now },
    reason: { type: String, enum: KeyReason },
    cid: { type: String },
  },
  { timestamps: true },
);

export const Account = mongoose.model('Account', accountSchema);
