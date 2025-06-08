import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import helmet from 'helmet';
import { env } from './env';
import { schema } from './graphql';
import { GraphQLError } from 'graphql';
import { connectDatabase } from './db';

const app = express();
app.use(helmet());
app.use(express.json());

app.all(
  '/graphql',
  createHandler({
    schema,
    formatError: (error) => {
      if (error instanceof GraphQLError) {
        return error;
      }
      return new GraphQLError(error.message, {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    },
  }),
);

await connectDatabase();

app.listen(env.PORT, async () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${env.PORT}/graphql`);
});
