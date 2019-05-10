import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';
import { BenefitType } from './Benefit';
import { updatePatient } from './Patient';

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

let patientChoices: PatientChoice[] = [];

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

const checkIsExamBenefitType = (benefitType: BenefitType) =>
  _.includes([BenefitType.OPTOS_EYE_EXAMINATION, BenefitType.STANDARD_EYE_EXAMINATION], benefitType);

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
    patientChoices = _.reject(patientChoices, patientChoice => {
      const isSamePatient = patientChoice.patientId === newPatientChoice.patientId;
      const isSameBenefitType = checkIsExamBenefitType(newPatientChoice.benefitType)
        ? checkIsExamBenefitType(patientChoice.benefitType)
        : newPatientChoice.benefitType === patientChoice.benefitType;

      return isSamePatient && isSameBenefitType;
    });

    patientChoices.push(newPatientChoice);

    const newTotalCostForPatient = _.sumBy(await getAllPatientChoicesForPatient(newPatientChoice.patientId), 'cost');

    await updatePatient(newPatientChoice.patientId, { totalCost: newTotalCostForPatient });

    return newPatientChoice;
  }

  @Mutation(returns => Boolean)
  async removePatientChoice(@Arg('patientChoiceId') patientChoiceId: string) {
    patientChoices = _.filter(patientChoices, patientChoice => patientChoice.id !== patientChoiceId);

    return true;
  }
}
