import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import _ from 'lodash';
import {
  Patient,
  updatePatient,
  getAllPatientsByVisualGuide,
  PatientStage,
  getAllPatientsByDoctor,
  getAllPatientsByStore,
} from './Patient';

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

  @Field()
  patientsJson: string;
}

let associates: Associate[] = [
  {
    id: 'test-vg',
    storeId: 'test-store',
    firstName: 'Vizzie',
    lastName: 'Guiderro',
    role: AssociateRole.VISUAL_GUIDE,
    patientsJson: JSON.stringify(['test-patient']),
  },
  {
    id: 'test-doctor',
    storeId: 'test-store',
    firstName: 'Doc',
    lastName: 'Eyefixer',
    role: AssociateRole.DOCTOR,
    patientsJson: JSON.stringify(['test-patient']),
  },
  {
    id: 'test-ceo',
    storeId: 'test-store',
    firstName: 'Keo',
    lastName: 'Newreeves',
    role: AssociateRole.CHIEF_EXPERIENCE_OFFICER,
    patientsJson: JSON.stringify([]),
  },
];

export const getAllAssociates = async () => associates;

export const getAllAssociatesForStore = async (storeId: string) => _.filter(associates, { storeId });

export const getAllAssociatesWithRoleForStore = async (role: AssociateRole, storeId: string) =>
  _.filter(associates, { role, storeId });

const addPatientToAssociate = async (associateId: string, patientId: string) => {
  const associate = _.find(associates, { id: associateId });
  if (associate) {
    const oldPatients = JSON.parse(associate.patientsJson);
    const newPatients = [...oldPatients, patientId];
    associate.patientsJson = JSON.stringify(newPatients);
  }
};

const removePatientFromAssociate = async (associateId: string, patientId: string) => {
  const associate = _.find(associates, { id: associateId });
  if (associate) {
    const oldPatients = JSON.parse(associate.patientsJson);
    const newPatients = _.without(oldPatients, patientId);
    associate.patientsJson = JSON.stringify(newPatients);
  }
};

const countAssociatePatients = (associate: Associate) => _.size(JSON.parse(associate.patientsJson));

export const assignAssociateToPatient = async (patientId: string, associateRole: AssociateRole, storeId: string) => {
  const associatesWithRoleInStore = await getAllAssociatesWithRoleForStore(associateRole, storeId);
  const associateWithFewestPatients = _.minBy(associatesWithRoleInStore, countAssociatePatients);
  if (associateWithFewestPatients) {
    addPatientToAssociate(associateWithFewestPatients.id, patientId);
    return associateWithFewestPatients.id;
  }
  return null;
};

export const unassignAssociateFromPatient = async (patient: Patient, associateId: string) => {
  removePatientFromAssociate(associateId, patient.id);
  return null;
};

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
    const foundAssociate = _.find(associates, {
      firstName: newAssociateData.firstName,
      lastName: newAssociateData.lastName,
    });
    if (!foundAssociate) {
      const newAssociate = {
        ...newAssociateData,
        id: uuid(),
        patientsJson: JSON.stringify([]),
      };
      associates.push(newAssociate);
      const allPatientsForStore = await getAllPatientsByStore(newAssociate.storeId);
      const allCheckedInPatients = _.reject(allPatientsForStore, { stage: PatientStage.SCHEDULED });
      if (newAssociate.role === AssociateRole.VISUAL_GUIDE) {
        const checkedInPatientsWithoutVG = _.filter(allCheckedInPatients, { visualGuideId: null });
        _.each(checkedInPatientsWithoutVG, patient => updatePatient(patient.id, { visualGuideId: newAssociate.id }));
      } else if (newAssociate.role === AssociateRole.DOCTOR) {
        const checkedInPatientsWithoutDoctor = _.filter(allCheckedInPatients, { doctorId: null });
        _.each(checkedInPatientsWithoutDoctor, patient => updatePatient(patient.id, { doctorId: newAssociate.id }));
      }

      return newAssociate;
    }

    return foundAssociate;
  }

  @Mutation(returns => Boolean)
  async removeAssociate(@Arg('associateId') associateId: string) {
    const associate = _.find(associates, { id: associateId });
    associates = _.reject(associates, { id: associateId });
    if (associate) {
      const patientIds: string[] = JSON.parse(associate.patientsJson);
      if (_.includes([AssociateRole.VISUAL_GUIDE, AssociateRole.DOCTOR], associate.role)) {
        const newIdPromises = _.map(patientIds, patientId =>
          assignAssociateToPatient(patientId, associate.role, associate.storeId),
        );
        const newIds = await Promise.all(newIdPromises);
        const patientAssociates = _.zip(patientIds, newIds);
        const updatedPatientPromises = _.map(patientAssociates, ([patientId, newId]) =>
          updatePatient(
            patientId,
            associate.role === AssociateRole.DOCTOR ? { doctorId: newId } : { visualGuideId: newId },
          ),
        );
        await Promise.all(updatedPatientPromises);
      }
    }

    return true;
  }
}
