import express from 'express';
import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import helmet from 'helmet';
import { env } from './env';

const app = express();
app.use(helmet());
app.use(express.json());

const schema = buildSchema(`
  type DiceConfig {
	  numDice: Int
	  numSides: Int
  }

  type Query {
    hello: String
    rollDice(numDice: Int!, numSides: Int): DiceConfig
  }
`);

const root = {
  hello() {
    return 'Hello World';
  },

  rollDice: ({ numDice, numSides }) => {
    return { numDice, numSides };
  },
};

app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

app.listen(env.PORT, async () => {
  console.log(`running on ${env.PORT}`);
});
