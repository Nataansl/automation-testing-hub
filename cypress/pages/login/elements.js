// Seletores da tela de login.
// TODO: ajuste para os seletores da sua aplicação (prefira atributos
// dedicados a teste, ex.: [data-cy="email"]).
export const elements = {
  emailInput: "#email",
  passwordInput: "#password",
  loginButton: "button[type='submit']",

  // Elemento que só existe após autenticar (ex.: menu lateral, avatar do
  // usuário). Serve de "gate" para confirmar que o login terminou.
  areaLogada: "[data-cy='menu']",

  // Modal/toast de erro exibido pela aplicação
  notificationTitle: "[data-cy='notificacao-titulo']",
  notificationMessage: "[data-cy='notificacao-mensagem']",
};

// Textos esperados nas validações.
// TODO: ajuste para as mensagens exibidas pela sua aplicação.
export const mensagens = {
  tituloErro: "Atenção",
  credenciaisInvalidas: "Usuário ou senha inválidos",
  camposVazios: "Informe o email e a senha",
};
