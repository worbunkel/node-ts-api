import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import * as _ from 'lodash';

enum ExamType {
  EYE_CHART = 'Eye Chart',
  EYE_MACHINE = 'Eye Machine',
  EXAM = 'Exam',
}

@ObjectType()
class PatientResult {
  @Field()
  id: string;

  @Field()
  patientId: string;

  @Field()
  examType: ExamType;

  @Field()
  result: string;
}

let patientResults: PatientResult[] = [
  {
    id: 'test-patient-result',
    patientId: 'test-patient',
    examType: ExamType.EYE_CHART,
    result: '20/50',
  },
];

export const getAllPatientResultsForPatient = async (patientId: string): Promise<PatientResult[]> =>
  _.filter(patientResults, { patientId });

@InputType()
class NewPatientResultInput {
  @Field()
  patientId: string;

  @Field()
  examType: ExamType;

  @Field()
  result: string;
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
