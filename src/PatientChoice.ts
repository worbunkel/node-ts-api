import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import _ from 'lodash';
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
  costBeforeInsurance: number;

  @Field()
  cost: number;

  @Field({ nullable: true })
  options?: string;
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
  costBeforeInsurance: number;

  @Field()
  cost: number;

  @Field({ nullable: true })
  options?: string;
}

const sameBenefitTypes = [
  [BenefitType.OPTOS_EYE_EXAMINATION, BenefitType.STANDARD_EYE_EXAMINATION],
  [
    BenefitType.TRIFOCAL_LENSES,
    BenefitType.LINED_BIFOCAL_LENSES,
    BenefitType.SINGLE_VISION_LENSES,
    BenefitType.STANDARD_PROGRESSIVE_LENSES,
    BenefitType.PREMIUM_PROGRESSIVE_LENSES,
    BenefitType.ULTRA_PROGRESSIVE_LENSES,
  ],
];

const checkIsSameBenefitType = (benefitType: BenefitType, otherBenefitType: BenefitType) =>
  _.some(
    sameBenefitTypes,
    sameBenefitSet => _.includes(sameBenefitSet, benefitType) && _.includes(sameBenefitSet, otherBenefitType),
  );

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
      const isSameBenefitType = checkIsSameBenefitType(newPatientChoice.benefitType, patientChoice.benefitType);

      return isSamePatient && isSameBenefitType;
    });

    patientChoices.push(newPatientChoice);

    const allPatientChoices = await getAllPatientChoicesForPatient(newPatientChoice.patientId);
    const newTotalCost = _.sumBy(allPatientChoices, 'cost');
    const newTotalCostBeforeInsurance = _.sumBy(allPatientChoices, 'costBeforeInsurance');

    await updatePatient(newPatientChoice.patientId, {
      totalCost: newTotalCost,
      totalCostBeforeInsurance: newTotalCostBeforeInsurance,
    });

    return newPatientChoice;
  }

  @Mutation(returns => Boolean)
  async removePatientChoice(@Arg('patientChoiceId') patientChoiceId: string) {
    patientChoices = _.filter(patientChoices, patientChoice => patientChoice.id !== patientChoiceId);

    return true;
  }
}
