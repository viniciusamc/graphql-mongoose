import express from 'express';
import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';

const app = express();

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

app.listen(process.env.PORT, () => {
  console.log(`running on ${process.env.PORT}`);
});
