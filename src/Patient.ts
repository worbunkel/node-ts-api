import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';
import { assignAssociateToPatient, AssociateRole, unassignAssociateFromPatient } from './Associate';

enum PatientStage {
  SCHEDULED = 'Scheduled',
  WAITING = 'Waiting',
  CHOOSING_EXAM_TYPE = 'Choosing Exam Type',
  EYE_CHART = 'Eye Chart',
  RETINAL_SCAN = 'Retinal Scan',
  EXAM = 'Exam',
  CHOOSING_FRAMES = 'Choosing Frames',
}

const advanceStage = async (patient: Patient) => {
  const updatedPatient = _.cloneDeep(patient);
  const stages = _.keys(PatientStage);
  const stageIndex = _.findIndex(stages, stage => _.isEqual(PatientStage[stage], patient.stage));
  if (stageIndex !== -1 && stageIndex < _.size(stages) - 1) {
    if (!patient.doctorId) {
      updatedPatient.doctorId = await assignAssociateToPatient(patient.id, AssociateRole.DOCTOR, patient.storeId);
    }
    if (!patient.visualGuideId) {
      updatedPatient.visualGuideId = await assignAssociateToPatient(
        patient.id,
        AssociateRole.VISUAL_GUIDE,
        patient.storeId,
      );
    }
    const newStage = PatientStage[stages[stageIndex + 1]];
    const oldStageMoveTimestamps = JSON.parse(patient.stageMoveTimestampsJson);
    const stageMoveTimestamps = _.uniqBy(
      [
        {
          time: new Date().toISOString(),
          stage: PatientStage[stages[stageIndex]],
        },
        ...oldStageMoveTimestamps,
      ],
      'stage',
    );
    return {
      ...updatedPatient,
      stage: newStage,
      stageMoveTimestampsJson: JSON.stringify(stageMoveTimestamps),
    };
  }
  return null;
};

const revertStage = async (patient: Patient) => {
  const updatedPatient = _.cloneDeep(patient);
  const stages = _.keys(PatientStage);
  const stageIndex = _.findIndex(stages, stage => _.isEqual(PatientStage[stage], patient.stage));
  if (stageIndex > 0) {
    const oldStage = PatientStage[stages[stageIndex]];
    if (oldStage === PatientStage.WAITING) {
      unassignAssociateFromPatient(patient, patient.doctorId);
      unassignAssociateFromPatient(patient, patient.visualGuideId);
      updatedPatient.doctorId = null;
      updatedPatient.visualGuideId = null;
    }
    const newStage = PatientStage[stages[stageIndex - 1]];
    const oldStageMoveTimestamps = JSON.parse(patient.stageMoveTimestampsJson);
    const stageMoveTimestamps = _.reject(oldStageMoveTimestamps, { stage: PatientStage[stages[stageIndex - 1]] });
    return {
      ...updatedPatient,
      stage: newStage,
      stageMoveTimestampsJson: JSON.stringify(stageMoveTimestamps),
    };
  }
  return patient;
};

@ObjectType()
export class Patient {
  @Field()
  id: string;

  @Field()
  storeId: string;

  @Field({ nullable: true })
  visualGuideId?: string;

  @Field({ nullable: true })
  doctorId?: string;

  @Field()
  insurancePlanId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  checkInTimeISO: string;

  @Field()
  stage: PatientStage;

  @Field()
  stageMoveTimestampsJson: string;
}

let patients: Patient[] = [
  {
    id: 'test-patient',
    firstName: 'Luke',
    lastName: 'Brown',
    email: 'luke@revunit.com',
    insurancePlanId: 'davis-vision-standard',
    stage: PatientStage.SCHEDULED,
    checkInTimeISO: new Date().toISOString(),
    doctorId: 'test-doctor',
    stageMoveTimestampsJson: JSON.stringify([]),
    storeId: 'test-store',
    visualGuideId: 'test-vg',
  },
];

export const getAllPatients = async (): Promise<Patient[]> => patients;

export const getAllPatientsByStore = async (storeId: string): Promise<Patient[]> => _.filter(patients, { storeId });

export const getAllPatientsByVisualGuide = async (visualGuideId: string): Promise<Patient[]> =>
  _.filter(patients, { visualGuideId });

export const getAllPatientsByDoctor = async (doctorId: string): Promise<Patient[]> => _.filter(patients, { doctorId });

export const updatePatient = async (patientId: string, newProperties: Partial<Patient>) => {
  const patient = _.find(patients, { id: patientId });
  if (patient) {
    _.each(newProperties, (value, key) => {
      _.set(patient, key, value);
    });
  }
};

@InputType()
class NewPatientInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  insurancePlanId: string;

  @Field()
  storeId: string;
}

@Resolver(Patient)
export class PatientResolver {
  @Query(returns => [Patient])
  async patients() {
    return await getAllPatients();
  }

  @Query(returns => [Patient])
  async patientsByStore(@Arg('storeId') storeId: string) {
    return await getAllPatientsByStore(storeId);
  }

  @Query(returns => [Patient])
  async patientsByVisualGuide(@Arg('visualGuideId') visualGuideId: string) {
    return await getAllPatientsByVisualGuide(visualGuideId);
  }

  @Query(returns => [Patient])
  async patientsByDoctor(@Arg('doctorId') doctorId: string) {
    return await getAllPatientsByDoctor(doctorId);
  }

  @Mutation(returns => Patient)
  async addPatient(@Arg('newPatientData') newPatientData: NewPatientInput): Promise<Patient> {
    const newPatientId = uuid();

    const newPatient: Patient = {
      ...newPatientData,
      id: newPatientId,
      stage: PatientStage.SCHEDULED,
      checkInTimeISO: new Date().toISOString(),
      stageMoveTimestampsJson: JSON.stringify([]),
    };
    patients.push(newPatient);

    return newPatient;
  }

  @Mutation(returns => Boolean)
  async advancePatientStage(@Arg('patientId') patientId: string): Promise<boolean> {
    const patient = _.find(patients, { id: patientId });
    if (patient) {
      const newPatient = await advanceStage(patient);
      patients = _.compact(_.concat(_.without(patients, patient), newPatient));
      return true;
    }

    return false;
  }

  @Mutation(returns => Boolean)
  async revertPatientStage(@Arg('patientId') patientId: string): Promise<boolean> {
    const patient = _.find(patients, { id: patientId });
    if (patient) {
      const newPatient = await revertStage(patient);
      patients = _.concat(_.without(patients, patient), newPatient);
      return true;
    }

    return false;
  }
}
