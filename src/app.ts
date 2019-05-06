import 'reflect-metadata';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { PatientResolver } from './Patient';
import { AssociateResolver } from './Associate';
import { InsurancePlanResolver } from './InsurancePlan';
import { BenefitResolver } from './Benefit';
import { PatientChoiceResolver } from './PatientChoice';
import { PatientResultResolver } from './PatientResult';

const app: express.Application = express();

(async () => {
  const schema = await buildSchema({
    resolvers: [
      AssociateResolver,
      BenefitResolver,
      InsurancePlanResolver,
      PatientResolver,
      PatientChoiceResolver,
      PatientResultResolver,
    ],
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
