import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';

export enum AssociateRole {
  DOCTOR = 'Doctor',
  VISUAL_GUIDE = 'Visual Guide',
  CHIEF_EXPERIENCE_OFFICER = 'Chief Experience Officer',
  SEE_GREAT_CAPTAIN = 'See Great Captain',
}

@ObjectType()
class Associate {
  @Field()
  id: string;

  @Field()
  storeId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  role: AssociateRole;
}

let associates: Associate[] = [
  {
    id: 'test-vg',
    storeId: 'test-store',
    firstName: 'Vizzie',
    lastName: 'Guiderro',
    role: AssociateRole.VISUAL_GUIDE,
  },
  {
    id: 'test-doctor',
    storeId: 'test-store',
    firstName: 'Doc',
    lastName: 'Eyefixer',
    role: AssociateRole.DOCTOR,
  },
  {
    id: 'test-ceo',
    storeId: 'test-store',
    firstName: 'Keo',
    lastName: 'Newreeves',
    role: AssociateRole.CHIEF_EXPERIENCE_OFFICER,
  },
];

export const getAllAssociates = async (): Promise<Associate[]> => associates;

export const getAllAssociatesForStore = async (storeId: string): Promise<Associate[]> =>
  _.filter(associates, { storeId });

@InputType()
class NewAssociateInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  storeId: string;

  @Field()
  role: AssociateRole;
}

@Resolver(Associate)
export class AssociateResolver {
  @Query(returns => [Associate])
  async associates() {
    return await getAllAssociates();
  }

  @Query(returns => [Associate])
  async associatesByStore(@Arg('storeId') storeId: string) {
    return await getAllAssociatesForStore(storeId);
  }

  @Mutation(returns => Associate)
  async addAssociate(@Arg('newAssociateData') newAssociateData: NewAssociateInput): Promise<Associate> {
    const newAssociate = {
      ...newAssociateData,
      id: uuid(),
    };
    associates.push(newAssociate);

    return newAssociate;
  }

  @Mutation(returns => Boolean)
  async removeAssociate(@Arg('associateId') associateId: string) {
    // TODO: Update to reassign VGs to any patients who are associated with this VG
    associates = _.filter(associates, associate => associate.id !== associateId);

    return true;
  }
}
