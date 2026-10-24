import Login from "../../pages/login";
import rotas from "../../pages/rotas";

describe("Login", { testIsolation: true }, () => {
  // Cada teste parte da tela de login limpa.
  beforeEach(() => {
    Login.visitarApp();
  });

  // Usa as credenciais do ambiente ativo (DEV_* ou PROD_* no .env)
  it("Realizar login com sucesso", () => {
    // Act
    Login.autenticar();

    // Assert
    rotas.validarHome();
  });

  it("Realizar login com credenciais inválidas", () => {
    // Act
    Login.preencherCredenciaisInvalidas();

    // Assert
    Login.verificarMensagemCredenciaisInvalidas();
    rotas.validarLogin();
  });

  it("Realizar login com campos vazios", () => {
    // Act
    Login.loginComCamposVazios();

    // Assert
    Login.verificarMensagemCamposVazios();
    Login.validarTelaLogin();
  });
});
