import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';
import { readFileSync } from 'fs';

export enum BenefitType {
  EYE_EXAMINATION = 'Eye Examination',
  OPTOS_EYE_EXAMINATION = 'Optos Eye Examination',
  SPECTACLE_LENSES = 'Spectacle Lenses',
  FRAMES = 'Frames',
  SINGLE_VISION_LENSES = 'Single Vision Lenses',
  LINED_BIFOCAL_LENSES = 'Lined Bifocal Lenses',
  TRIFOCAL_LENSES = 'Trifocal Lenses',
  GRADIENT_TINT = 'Gradient Tint',
  SOLID_TINT = 'Solid Tint',
  SCRATCH_RESISTANT_COATING = 'Scratch-Resistant Coating',
  POLYCARBONATE_LENSES = 'Polycarbonate Lenses',
  ULTRAVIOLET_COATING = 'Ultraviolet Coating',
  INTERMEDIATE_VISION_LENSES = 'Intermediate-Vision Lenses',
  STANDARD_ANTI_REFLECTIVE_COATING = 'Standard Anti-Reflective Coating',
  PREMIUM_ANTI_REFLECTIVE_COATING = 'Premium Anti-Reflective Coating',
  ULTRA_ANTI_REFLECTIVE_COATING = 'Ultra Anti-Reflective Coating',
  STANDARD_PROGRESSIVE_LENSES = 'Standard Progressive Lenses',
  PREMIUM_PROGRESSIVES_LENSES = 'Premium Progressives Lenses',
  ULTRA_PROGRESSIVES_LENSES = 'Ultra Progressives Lenses',
  HIGH_INDEX_LENSES = 'High-Index Lenses',
  POLARIZED_LENSES = 'Polarized Lenses',
  PLASTIC_PHOTOSENSITIVE_LENSES = 'Plastic Photosensitive Lenses',
  SCRATCH_PROTECTION_PLAN_SINGLE_VISION = 'Scratch Protection Plan (Single Vision)',
  SCRATCH_PROTECTION_PLAN_MULTIFOCAL = 'Scratch Protection Plan (Multifocal)',
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

const importBenefitsFromCSV = () => {
  const benefitsCSVPath = 'InsurancePlans.csv';
  const fileContents = readFileSync(benefitsCSVPath, 'utf-8');
  const fileContentsWithoutReturns = _.replace(fileContents, /\r/g, '');
  const [headers, ...lines] = _.split(fileContentsWithoutReturns, '\n');
  const splitHeaders = _.split(headers, ',');
  const headersWithCopay = _.filter(splitHeaders, header => _.includes(header, 'copay'));
  const insurancePlanIds = _.map(headersWithCopay, header => _.first(_.split(header, ' ')));
  return _.reduce(
    lines,
    (benefits, line, index) => {
      const splitLine = _.map(_.split(line, ','), word => _.replace(word, /\r/g, ''));
      const newObj = _.zipObject(splitHeaders, splitLine);
      const newBenefits = _.map(insurancePlanIds, insurancePlanId => ({
        type: BenefitType[newObj.type],
        id: `${insurancePlanId}-${index + 1}`,
        insurancePlanId,
        copay: parseInt(newObj[`${insurancePlanId} copay`]),
        limit: _.includes(newObj[`${insurancePlanId} limit`], 'null')
          ? null
          : parseInt(newObj[`${insurancePlanId} limit`]),
      }));

      return _.concat(benefits, newBenefits);
    },
    [] as Benefit[],
  );
};

let benefits: Benefit[] = importBenefitsFromCSV();

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
