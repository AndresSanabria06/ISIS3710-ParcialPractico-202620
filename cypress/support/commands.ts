// Comandos reutilizables para las pruebas E2E

// Crea un usuario nuevo directamente en el back y deja la sesión guardada
// en el localStorage, igual que lo hace la página de registro.
Cypress.Commands.add("loginByApi", () => {
  const id = Date.now();
  const userName = `cypress${id}`;

  cy
    .request("POST", `${Cypress.expose("apiUrl")}/users/signin`, {
      userName,
      name: "Usuario Cypress",
      email: `${userName}@test.com`,
      password: "ClaveDePrueba123",
    })
    .then((response) => {
      window.localStorage.setItem("id", response.body.id);
      window.localStorage.setItem("username", userName);
    });
});

// Llena el formulario de creación de un plan con datos válidos
Cypress.Commands.add("fillValidPlan", (planName: string) => {
  cy.get("#image").type("https://picsum.photos/seed/cypress/1200/700");
  cy.get("#name").type(planName);
  cy.get("#address").type("Bahía de las Brisas • Muelle Norte");
  cy.get("#price").type("65000");
  cy.get("#duration").type("150");
  cy.get("#description").type(
    "Una tarde relajada remando en tabla por la bahía mientras cae el sol."
  );
  cy.get("#recommendations").type("Llevar protector solar, toalla y agua");
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginByApi(): Chainable<void>;
      fillValidPlan(planName: string): Chainable<void>;
    }
  }
}

export {};
