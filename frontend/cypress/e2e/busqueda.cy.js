/**
 * Test E2E (Entrega 4): flujo de Búsqueda de turnos.
 *
 * Requisitos para correrlo:
 *  - Backend levantado en http://localhost:3000 con la base seedeada.
 *  - Frontend levantado en http://localhost:3001 (baseUrl de cypress.config.js).
 *
 * Recorre el camino feliz: elegir un paciente, buscar turnos disponibles,
 * preseleccionar uno y verificarlo en la pantalla de preselección.
 */
describe("Búsqueda de turnos", () => {
  it("permite a un paciente buscar y preseleccionar un turno", () => {
    cy.visit("/");

    // Ingresar como paciente desde el selector de usuario.
    cy.contains("button", "Juan Domínguez").click();

    // Quedamos en la pantalla de búsqueda.
    cy.url().should("include", "/buscar");
    cy.contains("h1", "Buscar turnos");

    // Esperamos los resultados (cada tarjeta muestra "Abonás").
    cy.contains("Abonás", { timeout: 15000 }).should("be.visible");

    // Preseleccionar el primer turno disponible.
    cy.contains("button", "Preseleccionar").first().click();
    cy.contains("button", "En preselección").should("exist");

    // El contador de la preselección en el menú debe reflejar 1.
    cy.contains("a", "Preselección").click();
    cy.url().should("include", "/carrito");
    cy.contains("h1", "Mi preselección");
    cy.contains("Total a abonar");
  });
});
