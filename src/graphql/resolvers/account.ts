import { GraphQLError } from 'graphql';
import { accountValidation } from '../validation/account.validation';
import { Account } from '../../db/schemas/account.schema';
import crypto from 'crypto';
import { KeyTypesEnum } from '../../utils/enum/key-types';

export const accountResolvers = {
  Query: {
    account: async (
      _: any,
      {
        key,
        includeStatistics,
        piRequestingParticipant,
      }: {
        key: string;
        includeStatistics: boolean;
        piRequestingParticipant: string;
      },
    ) => {
      const account = await Account.findOne({ key });

      if (!account) {
        throw new GraphQLError('Not Found.');
      }

      return account;
    },
  },

  Mutation: {
    createAccount: async (_: any, { data }: { data: any }) => {
      const validation = accountValidation.safeParse(data);

      if (!validation.success) {
        throw new GraphQLError('Validation Error', {
          extensions: {
            details: validation.error.format(),
          },
        });
      }

      if (validation.data.keyType === KeyTypesEnum.EVP) {
        validation.data.key = crypto.randomUUID();
      }

      const { requestId, ...accountParams } = validation.data;

      const requestIdBytes = Buffer.from(
        validation.data.requestId.replace(/-/g, ''),
        'hex',
      );

      const hmac = crypto.createHmac('sha256', requestIdBytes);
      hmac.update(JSON.stringify(accountParams), 'utf8');

      const cid = hmac.digest('hex').toLowerCase();

      const idempotency = await Account.findOne({ cid }); // concurrency errors -> 2 check cid at same, they wont detech each other // mongodb unique?

      if (idempotency) {
        return idempotency;
      }

      const dictKey = await Account.findOne({ key: accountParams.key });

      if (dictKey) {
        throw new GraphQLError('Key in use.');
      }

      const dictRequestId = await Account.findOne({ requestId });
      if (dictRequestId) {
        throw new GraphQLError('RequestIdAlreadyUsed');
      }

      const account = await Account.create({ ...validation.data, cid });

      return account;
    },
  },
};
