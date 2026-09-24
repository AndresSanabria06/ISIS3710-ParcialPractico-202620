// Edge case: el flujo de creación falla y el plan NO se crea.
describe("Crear plan - edge case", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/plans").as("createPlan");
  });

  it("no publica el plan si los datos del formulario son inválidos", () => {
    cy.loginByApi();
    cy.visit("/plans/create");
    // El menú de usuario solo se pinta en el navegador: cuando aparece, React ya
    // hidrató la página y lo que se escriba en el formulario no se pierde
    cy.get("header a[href='/plans/create']").should("be.visible");

    cy.get("#name").type("A"); // menos de 2 caracteres
    cy.get("#address").type("Muelle Norte");
    cy.get("#price").type("0"); // debe ser mayor a 0
    cy.get("#duration").type("12.5"); // debe ser entero
    cy.get("#description").type("x".repeat(600), { delay: 0 }); // debe tener menos de 600
    cy.contains("button", "Publicar plan").click();

    // Se muestran los errores de cada campo y se enfoca el primero inválido
    cy.get("#name-error").should("contain", "entre 2 y 50 caracteres");
    cy.get("#price-error").should("contain", "mayor a 0");
    cy.get("#duration-error").should("contain", "número entero");
    cy.get("#description-error").should("contain", "menos de 600 caracteres");
    cy.get("#name").should("have.attr", "aria-invalid", "true").and("be.focused");
    // Las recomendaciones son opcionales, así que no tienen error
    cy.get("#recommendations-error").should("not.exist");

    // No se envió nada al back y seguimos en la misma página
    cy.get("@createPlan.all").should("have.length", 0);
    cy.location("pathname").should("eq", "/plans/create");
  });

  it("muestra un error y no redirige si el back rechaza el plan", () => {
    // Sesión con un id que no es un UUID: el back real responde 400
    cy.visit("/plans/create", {
      onBeforeLoad(win) {
        win.localStorage.setItem("id", "usuario-invalido");
        win.localStorage.setItem("username", "cypress");
      },
    });
    // El menú de usuario solo se pinta en el navegador: cuando aparece, React ya
    // hidrató la página y lo que se escriba en el formulario no se pierde
    cy.get("header a[href='/plans/create']").should("be.visible");

    const planName = `Plan fallido ${Date.now()}`;
    cy.fillValidPlan(planName);
    cy.contains("button", "Publicar plan").click();

    cy.wait("@createPlan").its("response.statusCode").should("eq", 400);
    cy.get("[role=alert]").should("contain", "No se pudo publicar el plan");
    cy.location("pathname").should("eq", "/plans/create");

    // El plan no quedó en el listado
    cy.visit("/plans");
    cy.contains(planName).should("not.exist");
  });
});
