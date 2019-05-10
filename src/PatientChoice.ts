import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';
import { BenefitType } from './Benefit';

@ObjectType()
export class PatientChoice {
  @Field()
  id: string;

  @Field()
  patientId: string;

  @Field()
  benefitType: BenefitType;

  @Field()
  cost: number;
}

let patientChoices: PatientChoice[] = [
  {
    id: 'test-patient-choice',
    patientId: 'test-patient',
    benefitType: BenefitType.STANDARD_EYE_EXAMINATION,
    cost: 40,
  },
];

export const getAllPatientChoices = async (): Promise<PatientChoice[]> => patientChoices;

export const getAllPatientChoicesForPatient = async (patientId: string): Promise<PatientChoice[]> =>
  _.filter(patientChoices, { patientId });

@InputType()
class NewPatientChoiceInput {
  @Field()
  patientId: string;

  @Field()
  benefitType: BenefitType;

  @Field()
  cost: number;
}

@Resolver(PatientChoice)
export class PatientChoiceResolver {
  @Query(returns => [PatientChoice])
  async patientChoices(@Arg('patientId') patientId: string) {
    return await getAllPatientChoicesForPatient(patientId);
  }

  @Mutation(returns => PatientChoice)
  async addPatientChoice(
    @Arg('newPatientChoiceData') newPatientChoiceData: NewPatientChoiceInput,
  ): Promise<PatientChoice> {
    const newPatientChoice = {
      ...newPatientChoiceData,
      id: uuid(),
    };
    patientChoices.push(newPatientChoice);

    return newPatientChoice;
  }

  @Mutation(returns => Boolean)
  async removePatientChoice(@Arg('patientChoiceId') patientChoiceId: string) {
    patientChoices = _.filter(patientChoices, patientChoice => patientChoice.id !== patientChoiceId);

    return true;
  }
}
