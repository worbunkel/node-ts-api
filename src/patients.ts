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
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  insurance: string;

  @Field()
  stage: PatientStage;
}

let patients: Patient[] = [
  {
    id: uuid(),
    firstName: 'Luke',
    lastName: 'Brown',
    email: 'luke@revunit.com',
    insurance: 'Test Insurance Co',
    stage: PatientStage.EXAM,
  },
];

const getAllPatients = async (): Promise<Patient[]> => patients;

@InputType()
class NewPatientInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  insurance: string;
}

@Resolver(Patient)
export class PatientResolver {
  @Query(returns => [Patient])
  async patients() {
    const patients = await getAllPatients();

    return patients;
  }

  @Mutation(returns => Patient)
  async addPatient(@Arg('newPatientData') newPatientData: NewPatientInput): Promise<Patient> {
    const newPatient = {
      ...newPatientData,
      id: uuid(),
      stage: PatientStage.WAITING,
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
