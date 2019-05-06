import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';

@ObjectType()
class InsurancePlan {
  @Field()
  id: string;

  @Field()
  provider: string;

  @Field({ nullable: true })
  deductible?: number;
}

let insurancePlans: InsurancePlan[] = [
  {
    id: 'test-insurance-plan',
    provider: 'Fake Insurance Co',
  },
];

export const getAllInsurancePlans = async (): Promise<InsurancePlan[]> => insurancePlans;

@InputType()
class NewInsurancePlanInput {
  @Field()
  provider: string;

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
