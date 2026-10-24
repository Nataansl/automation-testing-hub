import Login from "../pages/login";

// Acessa o app e loga no ambiente ativo (ENV=dev|prod). Idempotente: se a
// sessão já estiver ativa (testIsolation:false), Login.autenticar() só
// confirma que a área logada carregou, sem preencher o formulário de novo.
Cypress.Commands.add("entrarNoApp", () => {
  Login.visitarApp();
  Login.autenticar();
});

// Espera curta pra rede/UI assentarem após uma ação. Não é uma espera por
// request específico — use cy.interceptarApi/cy.aguardarApi quando precisar
// confirmar uma chamada exata.
Cypress.Commands.add("aguardarRede", (ms = 800) => {
  cy.wait(ms);
});

// Intercepta chamadas de API, filtrando por método.
// Ex.: cy.interceptarApi("POST", "criarItem", "**/api/itens")
Cypress.Commands.add("interceptarApi", (metodo, alias, url) => {
  const metodos = [].concat(metodo);
  metodos.forEach((m) => cy.intercept(m, url).as(alias));
});

// Espera a chamada interceptada e confere se o status HTTP bate com o esperado
Cypress.Commands.add("aguardarApi", (alias, statusEsperado = 200, timeout = 25000) => {
  return cy.wait(`@${alias}`, { timeout }).then((interception) => {
    const status = interception.response?.statusCode;
    const esperados = [].concat(statusEsperado);
    expect(status, `status da chamada @${alias}`).to.be.oneOf(esperados);
    return interception;
  });
});

// Navega pra uma rota via callback (ex.: clicar no menu), só se ainda não
// estiver nela — idempotente, evita cliques desnecessários em testes que
// rodam com testIsolation:false.
Cypress.Commands.add("irPara", (rota, aoNavegar) => {
  cy.url().then((urlAtual) => {
    if (urlAtual.includes(rota)) return;

    aoNavegar();

    cy.url({ timeout: 15000 }).should("include", rota);
  });
});
