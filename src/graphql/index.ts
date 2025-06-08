import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { accountResolvers } from './resolvers/account';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: accountResolvers,
});
