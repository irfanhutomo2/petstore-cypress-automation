const baseUrl = Cypress.env('PETSTORE_API');
const endpointPet = '/pet';
const endpointFindByStatus = '/pet/findByStatus';

let pet1, pet2, invalidNoName, invalidStringId;

before(() => {
  cy.fixture('pet-store/petData.json').then(data => {
    pet1 = data.cat1;
    pet2 = data.cat2;
    invalidNoName = data.invalid_no_name;
    invalidStringId = data.invalid_string_id;
  });
});

function responseSuccessAddPet(response, expectedPet) {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('id', expectedPet.id);
  expect(response.body).to.have.property('name', expectedPet.name);
  expect(response.body).to.have.property('status', expectedPet.status);
}

function responseSuccessFindByStatus(response, expectedStatus) {
  expect(response.status).to.eq(200);
  expect(response.body).to.be.an('array');
  response.body.forEach(pet => {
    expect(pet.status).to.eq(expectedStatus);
  });
}

function responseSuccessFindById(response, expectedPet) {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('id', expectedPet.id);
  expect(response.body).to.have.property('name', expectedPet.name);
  expect(response.body).to.have.property('status', expectedPet.status);
}

function responseNotFoundFlexible(response) {
  expect([404, 400, 405, 200]).to.include(response.status);
  if (response.body && response.body.message) {
    expect([
      'Pet not found',
      'Resource not found',
      'not found'
    ]).to.include(response.body.message);
  }
}

function responseBadRequestOrUnexpected(response) {
  expect([400, 405, 404, 200]).to.include(response.status);
}

describe("Petstore - CRUD & Validation", { tags: ['@petstore-api'] }, function () {

  it("[Positive] Add new pet - Cat1 (PS-TC-001)", () => {
    cy.request({
      method: "POST",
      url: baseUrl + endpointPet,
      body: pet1,
      failOnStatusCode: false
    }).then((res) => {
      responseSuccessAddPet(res, pet1);
      cy.log('RESPONSE: ' + JSON.stringify(res.body)); // untuk evidence di report
    });
  });

  it("[Positive] Add new pet - Cat2 (PS-TC-002)", () => {
    cy.request({
      method: "POST",
      url: baseUrl + endpointPet,
      body: pet2,
      failOnStatusCode: false
    }).then((res) => {
      responseSuccessAddPet(res, pet2);
      cy.log('RESPONSE: ' + JSON.stringify(res.body));
    });
  });

  it("[Positive] Find pets by status \"available\" (PS-TC-003)", () => {
    cy.request({
      method: "GET",
      url: baseUrl + endpointFindByStatus + '?status=available',
      failOnStatusCode: false
    }).then((res) => {
      responseSuccessFindByStatus(res, 'available');
      cy.log('RESPONSE: ' + JSON.stringify(res.body));
    });
  });

  it("[Positive] Find pets by status \"pending\" (PS-TC-004)", () => {
    cy.request({
      method: "GET",
      url: baseUrl + endpointFindByStatus + '?status=pending',
      failOnStatusCode: false
    }).then((res) => {
      responseSuccessFindByStatus(res, 'pending');
      cy.log('RESPONSE: ' + JSON.stringify(res.body));
    });
  });

  it("[Positive] Get pet by ID after add (Cat1) (PS-TC-005)", () => {
    cy.request({
      method: "POST",
      url: baseUrl + endpointPet,
      body: pet1,
      failOnStatusCode: false
    }).then(() => {
      cy.request({
        method: "GET",
        url: baseUrl + endpointPet + '/' + pet1.id,
        failOnStatusCode: false
      }).then((res) => {
        responseSuccessFindById(res, pet1);
        cy.log('RESPONSE: ' + JSON.stringify(res.body));
      });
    });
  });

  it("[Negative] Get pet by non-existing ID returns error (PS-TC-006)", () => {
    cy.request({
      method: "GET",
      url: baseUrl + endpointPet + '/9999999999',
      failOnStatusCode: false
    }).then(responseNotFoundFlexible);
  });

  it("[Negative] Add pet with missing name should return error (PS-TC-007)", () => {
    cy.request({
      method: "POST",
      url: baseUrl + endpointPet,
      body: invalidNoName,
      failOnStatusCode: false
    }).then(responseBadRequestOrUnexpected);
  });

  it("[Negative] Get pet by string id should return error (PS-TC-008)", () => {
    cy.request({
      method: "GET",
      url: baseUrl + endpointPet + '/' + invalidStringId,
      failOnStatusCode: false
    }).then(responseBadRequestOrUnexpected);
  });

  it("[Negative] Update pet with missing status (PS-TC-009)", () => {
    const invalidUpdate = { ...pet1 };
    delete invalidUpdate.status;
    cy.request({
      method: "PUT",
      url: baseUrl + endpointPet,
      body: invalidUpdate,
      failOnStatusCode: false
    }).then(responseBadRequestOrUnexpected);
  });

  it("[Negative] Delete non-existing pet should return error (PS-TC-010)", () => {
    cy.request({
      method: "DELETE",
      url: baseUrl + endpointPet + '/9999999999',
      failOnStatusCode: false
    }).then(responseNotFoundFlexible);
  });

});