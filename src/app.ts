import 'reflect-metadata';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { PatientResolver } from './patients';

const app: express.Application = express();

(async () => {
  const schema = await buildSchema({
    resolvers: [PatientResolver],
  });
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  );
})();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(443, () => {
  console.log('Example app listening on port 3000!');
});
