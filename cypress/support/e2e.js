// Carregado automaticamente antes de cada spec.
// https://on.cypress.io/configuration
import "./commands";
import "cypress-mochawesome-reporter/register";

// Erros JS da aplicação que NÃO devem derrubar o teste.
// Adicione aqui trechos de mensagens conhecidas e inofensivas do seu sistema.
const ERROS_IGNORADOS = [
  // "ResizeObserver loop limit exceeded",
];

Cypress.on("uncaught:exception", (err) => {
  if (ERROS_IGNORADOS.some((trecho) => err.message.includes(trecho))) {
    return false;
  }
});
