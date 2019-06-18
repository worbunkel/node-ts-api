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

  @Field({ nullable: true })
  frameLensGroupId?: string;
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

  @Field({ nullable: true })
  frameLensGroupId?: string;
}

@InputType()
class NewFramesLensChoiceInput {
  @Field({ nullable: true })
  frameLensGroupId?: string;

  @Field(type => [NewPatientChoiceInput])
  patientChoices: NewPatientChoiceInput[];
}

const sameBenefitTypes = [[BenefitType.OPTOS_EYE_EXAMINATION, BenefitType.STANDARD_EYE_EXAMINATION]];
const frameAndLensTypes = [
  BenefitType.FRAMES,
  BenefitType.LENS_PACKAGE,
  BenefitType.SPECTACLE_LENSES,
  BenefitType.SMART_SCREEN_LENSES,
  BenefitType.SINGLE_VISION_LENSES,
  BenefitType.LINED_BIFOCAL_LENSES,
  BenefitType.TRIFOCAL_LENSES,
  BenefitType.GRADIENT_TINT,
  BenefitType.SOLID_TINT,
  BenefitType.SCRATCH_RESISTANT_COATING,
  BenefitType.POLYCARBONATE_LENSES,
  BenefitType.ULTRAVIOLET_COATING,
  BenefitType.INTERMEDIATE_VISION_LENSES,
  BenefitType.STANDARD_ANTI_REFLECTIVE_COATING,
  BenefitType.PREMIUM_ANTI_REFLECTIVE_COATING,
  BenefitType.ULTRA_ANTI_REFLECTIVE_COATING,
  BenefitType.STANDARD_PROGRESSIVE_LENSES,
  BenefitType.PREMIUM_PROGRESSIVE_LENSES,
  BenefitType.ULTRA_PROGRESSIVE_LENSES,
  BenefitType.HIGH_INDEX_LENSES,
  BenefitType.POLARIZED_LENSES,
  BenefitType.PLASTIC_PHOTOSENSITIVE_LENSES,
  BenefitType.SCRATCH_PROTECTION_PLAN_SINGLE_VISION,
  BenefitType.SCRATCH_PROTECTION_PLAN_MULTIFOCAL,
];

const checkIsSameBenefitType = (benefitType: BenefitType, otherBenefitType: BenefitType) =>
  benefitType === otherBenefitType ||
  _.some(
    sameBenefitTypes,
    sameBenefitSet => _.includes(sameBenefitSet, benefitType) && _.includes(sameBenefitSet, otherBenefitType),
  );

const checkIsFrameOrLensType = (benefitType: BenefitType) => _.includes(frameAndLensTypes, benefitType);

const checkIsSameFrameLensGroup = (patientChoice: PatientChoice, newPatientChoice: PatientChoice) =>
  !_.isNil(patientChoice.frameLensGroupId) && patientChoice.frameLensGroupId === newPatientChoice.frameLensGroupId;

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
    if (checkIsFrameOrLensType(newPatientChoice.benefitType) && _.isNil(newPatientChoice.frameLensGroupId)) {
      newPatientChoice.frameLensGroupId = uuid();
    }
    patientChoices = _.reject(patientChoices, patientChoice => {
      const isSamePatient = patientChoice.patientId === newPatientChoice.patientId;
      const isSameBenefitType = checkIsSameBenefitType(newPatientChoice.benefitType, patientChoice.benefitType);
      const isSameFrameLensGroup = checkIsSameFrameLensGroup(patientChoice, newPatientChoice);
      const isFrameOrLensType = checkIsFrameOrLensType(patientChoice.benefitType);

      return isSamePatient && (isSameBenefitType && (!isFrameOrLensType || isSameFrameLensGroup));
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
    patientChoices = _.reject(patientChoices, { id: patientChoiceId });

    return true;
  }

  @Mutation(returns => [PatientChoice])
  async addFramesLensChoice(
    @Arg('newFramesLensChoiceData') newFramesLensChoiceData: NewFramesLensChoiceInput,
  ): Promise<PatientChoice[]> {
    const frameLensGroupId = newFramesLensChoiceData.frameLensGroupId || uuid();
    const choicesWithFrameLensGroupId = _.map(newFramesLensChoiceData.patientChoices, choice => ({
      ...choice,
      frameLensGroupId,
    }));
    const patientChoicePromises = _.map(choicesWithFrameLensGroupId, this.addPatientChoice);

    return await Promise.all(patientChoicePromises);
  }
}
