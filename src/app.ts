import 'reflect-metadata';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { TodosResolver } from './Todos';

const app: express.Application = express();

(async () => {
  const schema = await buildSchema({
    resolvers: [TodosResolver],
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
  res.send('Healthy!');
});

const port = 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
