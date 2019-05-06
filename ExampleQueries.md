All Queries

```
{
  associates {
    id
    storeId
    firstName
    lastName
    role
  }
  associatesByStore(storeId: "test-store") {
    id
    storeId
    firstName
    lastName
    role
  }
  benefits(insurancePlanId: "test-insurance-plan") {
    id
    insurancePlanId
    type
    copay
    limit
  }
  insurancePlans {
    id
    provider
    deductible
  }
  patients {
    id
    storeId
    visualGuideId
    doctorId
    insurancePlanId
    firstName
    lastName
    email
    checkInTimeISO
    stage
    stageMoveTimestampsJson
  }
  patientsByStore(storeId: "test-store") {
    id
    storeId
    visualGuideId
    doctorId
    insurancePlanId
    firstName
    lastName
    email
    checkInTimeISO
    stage
    stageMoveTimestampsJson
  }
  patientsByDoctor(doctorId: "test-doctor") {
    id
    storeId
    visualGuideId
    doctorId
    insurancePlanId
    firstName
    lastName
    email
    checkInTimeISO
    stage
    stageMoveTimestampsJson
  }
  patientsByVisualGuide(visualGuideId: "test-vg") {
    id
    storeId
    visualGuideId
    doctorId
    insurancePlanId
    firstName
    lastName
    email
    checkInTimeISO
    stage
    stageMoveTimestampsJson
  }
  patientChoices(patientId: "test-patient") {
    id
    patientId
    benefitType
    cost
  }
  patientResults(patientId: "test-patient") {
    id
    patientId
    examType
    result
  }
}
```

All Mutations Except Removals

```
mutation {
  addPatient(newPatientData: {
    firstName: "Test",
		lastName: "User",
		email: "test.user@gmail.com",
		insurancePlanId: "test-insurance-plan",
		storeId: "test-store"
  }){
    id
		storeId
    visualGuideId
		doctorId
    insurancePlanId
    firstName
    lastName
    email
    checkInTimeISO
    stage
    stageMoveTimestampsJson
  }
  advancePatientStage(patientId: "test-patient")
  revertPatientStage(patientId: "test-patient")
  addAssociate(newAssociateData: {
    firstName: "New",
		lastName: "Associate",
		storeId: "test-store",
		role: "Doctor"
  }){
    id
    storeId
    firstName
    lastName
    role
  }
  addInsurancePlan(newInsurancePlanData: {
    provider: "Fakeins Co",
    deductible: 100
  }){
    id
    provider
    deductible
  }
  addBenefit(newBenefitData:{
    insurancePlanId: "test-insurance-plan",
    type: "Ultraviolet Protection",
    copay: 50
  }){
    id
    insurancePlanId
    type
    copay
    limit
  }
  addPatientChoice(newPatientChoiceData: {
    patientId: "test-patient",
    benefitType: "Ultraviolet Protection",
    cost: 85
  }){
    id
  	patientId
    benefitType
    cost
  }
  addPatientResult(newPatientResultData: {
    patientId: "test-patient",
    examType: "Eye Chart",
    result: "20/70",
  }){
    id
    patientId
    examType
    result
  }
}
```

All Removal Mutations

```
mutation {
  removeAssociate(associateId: "test-doctor")
  removeInsurancePlan(insurancePlanId: "test-insurance-plan")
  removeBenefit(benefitId: "test-benefit")
  removePatientChoice(patientChoiceId: "test-patient-choice")
  removePatientResult(patientResultId: "test-patient-result")
}
```
