import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import _ from 'lodash';
import { assignAssociateToPatient, AssociateRole, unassignAssociateFromPatient } from './Associate';
import { PatientChoice, getAllPatientChoices } from './PatientChoice';
import { getAllPatientResults, PatientResult } from './PatientResult';

export enum PatientStage {
  SCHEDULED = 'Scheduled',
  PROFILE_COMPLETION = 'Patient Profile',
  PRE_TEST = 'Pre-Test',
  EXAM = 'Exam',
  LENSES = 'Contacts + Lenses',
  FRAMES = 'Frames',
  CHECKOUT = 'Checkout',
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
    if (oldStage === PatientStage.PROFILE_COMPLETION) {
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
  insuranceGroupNumber: string;

  @Field()
  insurancePolicyNumber: string;

  @Field()
  insuranceRelationshipToPatient: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  addressLineOne: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  appointmentTimeISO: string;

  @Field()
  stage: PatientStage;

  @Field()
  stageMoveTimestampsJson: string;

  @Field()
  totalCostBeforeInsurance: number;

  @Field()
  totalCost: number;

  @Field(type => [PatientChoice])
  choices: PatientChoice[];

  @Field(type => [PatientResult])
  results: PatientResult[];

  @Field()
  currentFramesLensGroupId: string;
}

let patients: Patient[] = [
  {
    id: 'test-patient',
    firstName: 'Sarah',
    lastName: 'Kirke',
    email: 'skirke@test.com',
    addressLineOne: '123 Mary Street',
    city: 'San Antonio',
    state: 'TX',
    zip: '78204',
    insurancePlanId: 'davis-vision-standard',
    stage: PatientStage.SCHEDULED,
    appointmentTimeISO: new Date().toISOString().split('T')[0] + 'T14:15:00.000Z',
    doctorId: null,
    stageMoveTimestampsJson: JSON.stringify([]),
    storeId: 'test-store',
    visualGuideId: null,
    totalCostBeforeInsurance: 0,
    totalCost: 0,
    choices: [],
    results: [],
    insuranceGroupNumber: '876548392756',
    insurancePolicyNumber: '7583735',
    insuranceRelationshipToPatient: 'self',
    currentFramesLensGroupId: '1',
  },
  {
    id: 'test-patient-2',
    firstName: 'John',
    lastName: 'Jones',
    email: 'jjones@test.com',
    addressLineOne: '23 Oak Street',
    city: 'San Antonio',
    state: 'TX',
    zip: '78204',
    insurancePlanId: 'davis-vision-standard',
    stage: PatientStage.SCHEDULED,
    appointmentTimeISO: new Date().toISOString().split('T')[0] + 'T15:30:00.000Z',
    doctorId: null,
    stageMoveTimestampsJson: JSON.stringify([]),
    storeId: 'test-store',
    visualGuideId: null,
    totalCostBeforeInsurance: 0,
    totalCost: 0,
    choices: [],
    results: [],
    insuranceGroupNumber: '338562061692',
    insurancePolicyNumber: '8393209',
    insuranceRelationshipToPatient: 'self',
    currentFramesLensGroupId: '1',
  },
  {
    id: 'test-patient-3',
    firstName: 'Don',
    lastName: 'Jones',
    email: 'djones@test.com',
    addressLineOne: '331 Elm Lane',
    city: 'San Antonio',
    state: 'TX',
    zip: '78204',
    insurancePlanId: 'davis-vision-standard',
    stage: PatientStage.SCHEDULED,
    appointmentTimeISO: new Date().toISOString().split('T')[0] + 'T16:45:00.000Z',
    doctorId: null,
    stageMoveTimestampsJson: JSON.stringify([]),
    storeId: 'test-store',
    visualGuideId: null,
    totalCostBeforeInsurance: 0,
    totalCost: 0,
    choices: [],
    results: [],
    insuranceGroupNumber: '773639659026',
    insurancePolicyNumber: '4234891',
    insuranceRelationshipToPatient: 'self',
    currentFramesLensGroupId: '1',
  },
];

export const getAllPatients = async (): Promise<Patient[]> => {
  const allPatientChoices = await getAllPatientChoices();
  const allPatientResults = await getAllPatientResults();
  return _.map(patients, patient => ({
    ...patient,
    choices: _.filter(allPatientChoices, { patientId: patient.id }),
    results: _.filter(allPatientResults, { patientId: patient.id }),
  }));
};

export const getAllPatientsByStore = async (storeId: string): Promise<Patient[]> =>
  _.filter(await getAllPatients(), { storeId });

export const getAllPatientsByVisualGuide = async (visualGuideId: string): Promise<Patient[]> =>
  _.filter(await getAllPatients(), { visualGuideId });

export const getAllPatientsByDoctor = async (doctorId: string): Promise<Patient[]> =>
  _.filter(await getAllPatients(), { doctorId });

export const updatePatient = async (patientId: string, newProperties: Partial<Patient>) => {
  const patient = _.find(patients, { id: patientId });
  if (patient) {
    _.each(newProperties, (value, key) => {
      _.set(patient, key, value);
    });
  }
};

export const deletePatient = async (patientId: string) => {
  patients = _.reject(patients, { id: patientId });
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
  addressLineOne: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  insurancePlanId: string;

  @Field()
  insuranceGroupNumber: string;

  @Field()
  insurancePolicyNumber: string;

  @Field()
  insuranceRelationshipToPatient: string;

  @Field()
  storeId: string;

  @Field()
  appointmentTimeISO: string;
}

@InputType()
class UpdatePatientInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  storeId?: string;

  @Field({ nullable: true })
  visualGuideId?: string;

  @Field({ nullable: true })
  doctorId?: string;

  @Field({ nullable: true })
  insurancePlanId?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  appointmentTimeISO?: string;

  @Field({ nullable: true })
  stage?: PatientStage;

  @Field({ nullable: true })
  stageMoveTimestampsJson?: string;

  @Field({ nullable: true })
  totalCostBeforeInsurance?: number;

  @Field({ nullable: true })
  totalCost?: number;

  @Field({ nullable: true })
  currentFramesLensGroupId?: string;
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
      stageMoveTimestampsJson: JSON.stringify([]),
      choices: [],
      results: [],
      totalCostBeforeInsurance: 0,
      totalCost: 0,
      currentFramesLensGroupId: '1',
    };
    patients.push(newPatient);

    return newPatient;
  }

  @Mutation(returns => Boolean)
  async advancePatientStage(@Arg('patientId') patientId: string): Promise<boolean> {
    const patient = _.find(patients, { id: patientId });
    if (patient) {
      const newPatient = await advanceStage(patient);
      if (newPatient) {
        updatePatient(patient.id, newPatient);
      } else {
        deletePatient(patient.id);
      }
      return true;
    }

    return false;
  }

  @Mutation(returns => Boolean)
  async revertPatientStage(@Arg('patientId') patientId: string): Promise<boolean> {
    const patient = _.find(patients, { id: patientId });
    if (patient) {
      const newPatient = await revertStage(patient);
      updatePatient(newPatient.id, newPatient);
      return true;
    }

    return false;
  }

  @Mutation(returns => Boolean)
  async updatePatient(@Arg('updatePatientData') updatePatientData: UpdatePatientInput): Promise<boolean> {
    if (updatePatientData.id) {
      await updatePatient(updatePatientData.id, updatePatientData);
      return true;
    }

    return false;
  }
}
