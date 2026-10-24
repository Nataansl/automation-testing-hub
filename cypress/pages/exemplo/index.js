import { elements as el } from "./elements";

class Exemplo {
  // Navega até o módulo (idempotente: não faz nada se já estiver nele)
  acessarModulo() {
    cy.irPara(el.rota, () => {
      cy.get(el.menuItem, { timeout: 10000 }).click();
    });
  }

  // Cria um novo registro
  novoRegistro(descricao) {
    cy.get(el.botaoAdicionar, { timeout: 10000 }).should("be.visible").click();

    cy.get(el.inputDescricao).should("be.visible").type(descricao);

    this.salvar();
  }

  // Atualiza a descrição de um registro existente
  editarRegistro(descricaoAtual, novaDescricao) {
    // scrollIntoView() fora do chain de clique: se a tabela re-renderizar
    // entre o scroll e o find, o Cypress perde a referência da linha
    // ("element has detached from DOM"). Separado, cada comando re-consulta.
    cy.contains(el.linhaTabela, descricaoAtual).scrollIntoView();

    cy.contains(el.linhaTabela, descricaoAtual).find(el.botaoEditar).click();

    cy.get(el.inputDescricao).should("be.visible").clear().type(novaDescricao);

    this.salvar();
  }

  // Exclui um registro com base na descrição informada
  excluirRegistro(descricao) {
    cy.contains(el.linhaTabela, descricao).scrollIntoView();

    cy.contains(el.linhaTabela, descricao).find(el.botaoExcluir).click();

    cy.get(el.botaoConfirmar).should("not.be.disabled").click();

    cy.aguardarRede();
  }

  // Ação padrão para salvar
  salvar() {
    cy.get(el.botaoSalvar).should("not.be.disabled").click();

    cy.aguardarRede();
  }

  validarRegistroNaTabela(descricao) {
    cy.contains(el.linhaTabela, descricao, { timeout: 10000 }).should("be.visible");
  }

  validarRegistroAusente(descricao) {
    cy.contains(el.linhaTabela, descricao).should("not.exist");
  }

  verificarNotificacao(titulo, mensagem) {
    cy.get(el.notificationTitle, { timeout: 10000 })
      .should("be.visible")
      .and("contain", titulo);

    cy.get(el.notificationMessage, { timeout: 10000 })
      .should("be.visible")
      .and("contain", mensagem);
  }
}

export default new Exemplo();
