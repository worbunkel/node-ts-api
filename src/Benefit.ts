import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';

export enum BenefitType {
  EXAM = 'Exam',
  FRAMES_AND_LENSES = 'Frames and lenses',
  ANTI_REFLECTIVE_LENS_COATING = 'Anti-reflective lens coating',
  PHOTOCHROMIC_LENSES = 'Photochromic lenses',
  POLYCARBONATE_LENSES = 'Polycarbonate lenses',
  SCRATCH_RESISTANT_LENS_COATING = 'Scratch-resistant lens coating',
  ULTRAVIOLET_PROTECTION = 'Ultraviolet protection',
  PROGRESSIVE_LENSES = 'Progressive lenses',
  BLENDED_BIFOCAL_LENSES = 'Blended bifocal lenses',
}

@ObjectType()
class Benefit {
  @Field()
  id: string;

  @Field()
  insurancePlanId: string;

  @Field()
  type: BenefitType;

  @Field({ nullable: true })
  copay?: number;

  @Field({ nullable: true })
  limit?: number;
}

let benefits: Benefit[] = [
  {
    id: 'test-benefit',
    insurancePlanId: 'test-insurance-plan',
    type: BenefitType.EXAM,
    copay: 10,
  },
  {
    id: 'test-benefit-2',
    insurancePlanId: 'test-insurance-plan',
    type: BenefitType.FRAMES_AND_LENSES,
    copay: 25,
    limit: 150,
  },
];

export const getAllBenefitsForInsurancePlan = async (insurancePlanId: string): Promise<Benefit[]> =>
  _.filter(benefits, { insurancePlanId });

@InputType()
class NewBenefitInput {
  @Field()
  insurancePlanId: string;

  @Field()
  type: BenefitType;

  @Field({ nullable: true })
  copay?: number;

  @Field({ nullable: true, defaultValue: null })
  limit?: number;
}

@Resolver(Benefit)
export class BenefitResolver {
  @Query(returns => [Benefit])
  async benefits(@Arg('insurancePlanId') insurancePlanId: string) {
    return await getAllBenefitsForInsurancePlan(insurancePlanId);
  }

  @Mutation(returns => Benefit)
  async addBenefit(@Arg('newBenefitData') newBenefitData: NewBenefitInput): Promise<Benefit> {
    const newBenefit = {
      ...newBenefitData,
      id: uuid(),
    };
    benefits.push(newBenefit);

    return newBenefit;
  }

  @Mutation(returns => Boolean)
  async removeBenefit(@Arg('benefitId') benefitId: string) {
    benefits = _.filter(benefits, benefit => benefit.id !== benefitId);

    return true;
  }
}
