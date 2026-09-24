// Happy path: un usuario se registra, crea un plan contra el back real
// y lo encuentra en el listado de planes.
describe("Crear plan - happy path", () => {
  it("publica un plan nuevo y redirige al listado donde aparece", () => {
    const id = Date.now();
    const planName = `Plan Cypress ${id}`;

    // 1. Registro desde la interfaz
    cy.visit("/auth/register");
    // El menú del header solo se pinta en el navegador: cuando aparece, la página ya está hidratada
    cy.get("header a[href='/auth/register']").should("be.visible");
    cy.get("#username").type(`cypress${id}`);
    cy.get("#name").type("Usuario Cypress");
    cy.get("#email").type(`cypress${id}@test.com`);
    cy.get("#password").type("ClaveDePrueba123");
    cy.contains("button", "Crear cuenta").click();
    cy.location("pathname").should("eq", "/plans");

    // 2. Ir a la vista de creación desde el header
    cy.contains("a", "+ Crear Plan").click();
    cy.location("pathname").should("eq", "/plans/create");
    cy.contains("h1", "Crear un nuevo plan").should("be.visible");

    // 3. Llenar y publicar el plan
    cy.intercept("POST", "**/plans").as("createPlan");
    cy.fillValidPlan(planName);
    cy.get("#description-count").should("not.contain", "0 / 600");
    cy.contains("button", "Publicar plan").click();

    // 4. El back crea el plan con los datos enviados
    cy.wait("@createPlan").then(({ request, response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
      expect(request.body).to.include({
        name: planName,
        estimatedPrice: 65000,
        estimatedTime: 150,
        address: "Bahía de las Brisas • Muelle Norte",
      });
    });

    // 5. Redirige al listado y el plan nuevo aparece
    cy.location("pathname").should("eq", "/plans");
    cy.contains("h2", planName).should("be.visible");
  });
});
