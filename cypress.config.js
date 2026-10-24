require("dotenv").config();

const { defineConfig } = require("cypress");

// Ambiente ativo: definido no comando (ENV=dev|prod) ou no .env.
const ENV = process.env.ENV || "dev";

// URLs e credenciais vêm do .env (veja .env.example).
const urls = {
  dev: process.env.BASE_URL_DEV,
  prod: process.env.BASE_URL_PROD,
};

const users = {
  dev: {
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
  },
  prod: {
    username: process.env.PROD_USER,
    password: process.env.PROD_PASSWORD,
  },
};

module.exports = defineConfig({
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
    mochaJunitReporterReporterOptions: {
      mochaFile: "cypress/reports/junit/test-results-[hash].xml",
    },
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
      reportPageTitle: "Relatório de teste",
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
  },

  viewportWidth: 1280,
  viewportHeight: 858,
  defaultCommandTimeout: 8000,
  pageLoadTimeout: 30000,
  requestTimeout: 10000,
  responseTimeout: 20000,
  video: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  waitForAnimations: false,
  animationDistanceThreshold: 20,
  scrollBehavior: false,
  retries: { runMode: 0, openMode: 0 },
  numTestsKeptInMemory: 5,
  experimentalMemoryManagement: true,

  e2e: {
    baseUrl: urls[ENV],

    // false: a sessão (login) é reaproveitada entre os testes de um mesmo
    // spec. Use { testIsolation: true } no describe quando precisar de
    // cada teste partindo do zero (ex.: testes de login).
    testIsolation: false,

    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);

      if (!config.baseUrl) {
        throw new Error(
          `BASE_URL_${ENV.toUpperCase()} não definida. Crie o .env a partir do .env.example.`,
        );
      }

      return config;
    },
  },

  env: {
    ...users[ENV],
    ENV,
  },
});
