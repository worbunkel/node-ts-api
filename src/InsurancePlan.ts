import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import _ from 'lodash';
import { Benefit, getAllBenefits } from './Benefit';

@ObjectType()
class InsurancePlan {
  @Field()
  id: string;

  @Field()
  provider: string;

  @Field()
  planName: string;

  @Field({ nullable: true })
  deductible?: number;

  @Field(type => [Benefit])
  benefits: Array<Benefit>;
}

let insurancePlans: InsurancePlan[] = [
  {
    id: 'davis-vision-standard',
    provider: 'Davis Vision',
    deductible: 0,
    benefits: [],
    planName: 'Davis Vision Standard',
  },
  {
    id: 'davis-vision-premium',
    provider: 'Davis Vision',
    deductible: 0,
    benefits: [],
    planName: 'Davis Vision Premium',
  },
];

export const getAllInsurancePlans = async (): Promise<InsurancePlan[]> => {
  const allBenefits = await getAllBenefits();
  return _.map(insurancePlans, insurancePlan => ({
    ...insurancePlan,
    benefits: _.filter(allBenefits, { insurancePlanId: insurancePlan.id }),
  }));
};

@InputType()
class NewInsurancePlanInput {
  @Field()
  provider: string;

  @Field()
  planName: string;

  @Field({ nullable: true })
  deductible?: number;
}

@Resolver(InsurancePlan)
export class InsurancePlanResolver {
  @Query(returns => [InsurancePlan])
  async insurancePlans() {
    return await getAllInsurancePlans();
  }

  @Mutation(returns => InsurancePlan)
  async addInsurancePlan(
    @Arg('newInsurancePlanData') newInsurancePlanData: NewInsurancePlanInput,
  ): Promise<InsurancePlan> {
    const newInsurancePlan = {
      ...newInsurancePlanData,
      id: uuid(),
      benefits: [],
    };
    insurancePlans.push(newInsurancePlan);

    return newInsurancePlan;
  }

  @Mutation(returns => Boolean)
  async removeInsurancePlan(@Arg('insurancePlanId') insurancePlanId: string) {
    insurancePlans = _.filter(insurancePlans, insurancePlan => insurancePlan.id !== insurancePlanId);

    return true;
  }
}
