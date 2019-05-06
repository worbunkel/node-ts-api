import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';

enum PatientStage {
  WAITING = 'WAITING',
  EXAM = 'EXAM',
  CHOOSING_FRAMES = 'CHOOSING_FRAMES',
}

const advanceStage = (patient: Patient) => {
  const stages = _.keys(PatientStage);
  const stageIndex = _.findIndex(stages, stage => _.isEqual(PatientStage[stage], patient.stage));
  if (stageIndex !== -1 && stageIndex < _.size(stages) - 1) {
    const newStage = PatientStage[stages[stageIndex + 1]];
    return {
      ...patient,
      stage: newStage,
    };
  }
  return null;
};

const revertStage = (patient: Patient) => {
  const stages = _.keys(PatientStage);
  const stageIndex = _.findIndex(stages, stage => _.isEqual(PatientStage[stage], patient.stage));
  if (stageIndex > 0) {
    const newStage = PatientStage[stages[stageIndex - 1]];
    return {
      ...patient,
      stage: newStage,
    };
  }
  return patient;
};

@ObjectType()
class Patient {
  @Field()
  id: string;

  @Field()
  storeId: string;

  @Field()
  visualGuideId: string;

  @Field()
  doctorId: string;

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
    insurancePlanId: 'test',
    stage: PatientStage.EXAM,
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
    // TODO: Assign doctor
    // TODO: Assign visual guide
    const newPatient: Patient = {
      ...newPatientData,
      id: uuid(),
      stage: PatientStage.WAITING,
      checkInTimeISO: new Date().toISOString(),
      doctorId: 'test-doctor',
      stageMoveTimestampsJson: JSON.stringify([]),
      visualGuideId: 'test-vg',
    };
    patients.push(newPatient);

    return newPatient;
  }

  @Mutation(returns => Boolean)
  async advancePatientStage(@Arg('patientId') patientId: string): Promise<boolean> {
    const patient = _.find(patients, { id: patientId });
    if (patient) {
      const newPatient = advanceStage(patient);
      patients = _.compact(_.concat(_.without(patients, patient), newPatient));
      return true;
    }

    return false;
  }

  @Mutation(returns => Boolean)
  async revertPatientStage(@Arg('patientId') patientId: string): Promise<boolean> {
    const patient = _.find(patients, { id: patientId });
    if (patient) {
      const newPatient = revertStage(patient);
      patients = _.concat(_.without(patients, patient), newPatient);
      return true;
    }

    return false;
  }
}
