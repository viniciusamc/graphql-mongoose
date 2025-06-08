import { z } from 'zod';
import { KeyTypesEnum } from '../../utils/enum/key-types';
import { KeyReason } from '../../utils/enum/key-reason';

export const accountValidation = z.object({
  requestId: z.string().uuid(),
  key: z.string().nonempty(),
  keyType: z.nativeEnum(KeyTypesEnum),
  owner: z.object({
    name: z.string().nonempty(),
    taxIdNumber: z.string().nonempty(),
    type: z.string().nonempty(),
    tradeName: z.string().max(150).optional(),
  }),
  account: z.object({
    branch: z.string().regex(/^\d+$/),
    accountNumber: z.string().nonempty(),
    accountType: z.string().nonempty(),
    openingDate: z.string().date().nonempty(),
  }),
  reason: z.nativeEnum(KeyReason),
});
