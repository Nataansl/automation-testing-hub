import { elements as el, mensagens } from "./elements";

class Login {
  // Acessa a aplicação pela baseUrl do ambiente ativo (ENV=dev|prod).
  visitarApp() {
    cy.visit("/");
  }

  // Autentica usando as credenciais do ambiente ativo (username/password
  // resolvidos em cypress.config.js a partir do .env).
  //
  // Idempotente: com testIsolation:false a sessão pode continuar ativa de
  // um teste para o outro. Se o campo de email não existir, já está logado
  // - só confirma que a área logada carregou.
  autenticar(
    usuario = Cypress.env("username"),
    senha = Cypress.env("password"),
  ) {
    cy.get("body", { timeout: 15000 }).then(($body) => {
      if (!$body.find(el.emailInput).length) {
        cy.get(el.areaLogada, { timeout: 20000 }).should("be.visible");
        return;
      }

      cy.get(el.emailInput, { timeout: 15000 })
        .should("be.visible")
        .and("not.be.disabled")
        .clear()
        .type(usuario);
      cy.get(el.passwordInput)
        .should("not.be.disabled")
        .clear()
        .type(senha, { log: false });
      cy.get(el.loginButton).click();

      cy.get(el.areaLogada, { timeout: 20000 }).should("be.visible");
    });
  }

  // Credenciais inválidas (dados fictícios, não precisam existir)
  preencherCredenciaisInvalidas(
    email = "usuario.invalido@exemplo.com",
    senha = "senha-invalida",
  ) {
    cy.get(el.emailInput).should("be.visible").clear().type(email);
    cy.get(el.passwordInput).clear().type(senha, { log: false });
    cy.get(el.loginButton).click();
  }

  loginComCamposVazios() {
    cy.get(el.emailInput).should("be.visible").clear();
    cy.get(el.passwordInput).should("be.visible").clear();
    cy.get(el.loginButton).click();
  }

  verificarMensagemCredenciaisInvalidas() {
    this.verificarNotificacao(mensagens.tituloErro, mensagens.credenciaisInvalidas);
  }

  verificarMensagemCamposVazios() {
    this.verificarNotificacao(mensagens.tituloErro, mensagens.camposVazios);
  }

  verificarNotificacao(titulo, mensagem) {
    cy.get(el.notificationTitle, { timeout: 10000 })
      .should("be.visible")
      .and("contain", titulo);

    cy.get(el.notificationMessage, { timeout: 10000 })
      .should("be.visible")
      .and("contain", mensagem);
  }

  // Continua na tela de login: os campos precisam estar visíveis.
  validarTelaLogin() {
    cy.get(el.emailInput).should("be.visible");
  }
}

export default new Login();
