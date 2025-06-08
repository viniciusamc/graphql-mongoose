import { z } from 'zod';
import { KeyTypesEnum } from '../../utils/enum/key-types';
import { KeyReason } from '../../utils/enum/key-reason';

export const accountValidation = z
  .object({
    requestId: z.string().uuid(),
    key: z.string().optional(),
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
  })
  .refine(
    (data) => {
      if (data.keyType !== KeyTypesEnum.EVP && !data.key) {
        return false;
      }

      if (data.key === undefined) {
        return data.keyType === KeyTypesEnum.EVP;
      }

      if (data.keyType === KeyTypesEnum.CPF) {
        return /^[0-9]{11}$/.test(data.key);
      }

      if (data.keyType === KeyTypesEnum.CNPJ) {
        return /^[0-9]{14}$/.test(data.key);
      }

      if (data.keyType === KeyTypesEnum.PHONE) {
        return /^\+[1-9]\d{1,14}$/.test(data.key);
      }

      if (data.keyType === KeyTypesEnum.EMAIL) {
        return /^[a-z0-9.!#$&'*+\/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/.test(
          data.key,
        );
      }

      return true;
    },
    {
      message: 'Invalid key',
    },
  );
