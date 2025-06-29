Cypress.Commands.add('addPet', (pet) => {
    return cy.request({
        method: 'POST',
        url: '/pet',
        body: pet,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getPetById', (id) => {
    return cy.request({
        method: 'GET',
        url: `/pet/${id}`,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('findPetByStatus', (status) => {
    return cy.request({
        method: 'GET',
        url: `/pet/findByStatus?status=${status}`,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('updatePet', (pet) => {
    return cy.request({
        method: 'PUT',
        url: '/pet',
        body: pet,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deletePet', (id) => {
    return cy.request({
        method: 'DELETE',
        url: `/pet/${id}`,
        failOnStatusCode: false
    })
})