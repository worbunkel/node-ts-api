import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import _ from 'lodash';

enum ResultType {
  EYE_CHART = 'Eye Chart',
  EYE_PRESSURE = 'Eye Pressure',
  EXAM = 'Exam',
  PRESCRIPTION = 'Prescription',
}

@ObjectType()
export class PatientResult {
  @Field()
  id: string;

  @Field()
  patientId: string;

  @Field()
  resultType: ResultType;

  @Field()
  resultJson: string;
}

let patientResults: PatientResult[] = [
  {
    id: 'test-patient-result',
    patientId: 'test-patient',
    resultType: ResultType.PRESCRIPTION,
    resultJson: '{"Right (OD)":{"SPH":1.0,"CYL":0,"AXIS":0},"Left (OS)":{"SPH":0,"CYL":0,"AXIS":0},"PD":{"SPH":0}}',
  },
];

export const getAllPatientResults = async (): Promise<PatientResult[]> => patientResults;

export const getAllPatientResultsForPatient = async (patientId: string): Promise<PatientResult[]> =>
  _.filter(patientResults, { patientId });

@InputType()
class NewPatientResultInput {
  @Field()
  patientId: string;

  @Field()
  resultType: ResultType;

  @Field()
  resultJson: string;
}

@Resolver(PatientResult)
export class PatientResultResolver {
  @Query(returns => [PatientResult])
  async patientResults(@Arg('patientId') patientId: string) {
    return await getAllPatientResultsForPatient(patientId);
  }

  @Mutation(returns => PatientResult)
  async addPatientResult(
    @Arg('newPatientResultData') newPatientResultData: NewPatientResultInput,
  ): Promise<PatientResult> {
    const newPatientResult = {
      ...newPatientResultData,
      id: uuid(),
    };
    patientResults.push(newPatientResult);

    return newPatientResult;
  }

  @Mutation(returns => Boolean)
  async removePatientResult(@Arg('patientResultId') patientResultId: string) {
    patientResults = _.filter(patientResults, patientResult => patientResult.id !== patientResultId);
    return true;
  }
}
