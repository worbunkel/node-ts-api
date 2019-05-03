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

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
