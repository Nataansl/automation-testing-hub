import exemplo from "../../pages/exemplo";
import rotas from "../../pages/rotas";

// Modelo de spec CRUD. Copie e adapte para cada módulo da sua aplicação.
describe("Exemplo - CRUD", () => {
  let dados;

  // Login uma única vez por spec (testIsolation: false).
  before(() => {
    cy.fixture("exemplo").then((fixture) => {
      dados = fixture.registro;
    });

    cy.entrarNoApp();
  });

  // Navegação idempotente: não faz nada se já estiver no módulo.
  beforeEach(() => {
    exemplo.acessarModulo();
  });

  it("Criar registro", () => {
    // Act
    exemplo.novoRegistro(dados.descricao);

    // Assert
    exemplo.validarRegistroNaTabela(dados.descricao);
    rotas.validarExemplo();
  });

  it("Editar registro", () => {
    // Act
    exemplo.editarRegistro(dados.descricao, dados.descricaoEditada);

    // Assert
    exemplo.validarRegistroNaTabela(dados.descricaoEditada);
  });

  it("Excluir registro", () => {
    // Act
    exemplo.excluirRegistro(dados.descricaoEditada);

    // Assert
    exemplo.validarRegistroAusente(dados.descricaoEditada);
  });
});
