// Asserções de destino (rota alcançada).
//
// A checagem é sobre a URL corrente, sem cy.visit(): um visit bem-sucedido
// não prova que a aplicação navegou.
//
// TODO: ajuste/adicione as rotas da sua aplicação.
const rota = (caminho) => cy.url({ timeout: 15000 }).should("include", caminho);

class Rotas {
  validarHome() {
    return rota("/home");
  }

  validarLogin() {
    return rota("/login");
  }

  validarExemplo() {
    return rota("/exemplo");
  }
}

export default new Rotas();
