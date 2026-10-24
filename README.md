# automation-testing-hub

Arquitetura de referência para automação de testes End-to-End com Cypress, pronta para ser adaptada a qualquer aplicação web. Traz Page Object Pattern, suporte a múltiplos ambientes (dev/prod), credenciais isoladas em `.env`, comandos customizados reutilizáveis e relatórios HTML/JUnit.

O objetivo é servir como **ponto de partida padronizado**: basta apontar a URL e as credenciais do seu ambiente de teste, ajustar os seletores e começar a escrever cenários, sem precisar montar a estrutura do zero.

---

## 📌 Tecnologias

* Cypress
* JavaScript / Node.js
* dotenv
* Mochawesome Reporter
* Mocha JUnit Reporter

---

## 📁 Estrutura do projeto

```
.
├── .env.example              # Modelo de variáveis (URL, usuário, senha)
├── cypress.config.js         # Configuração central + seleção de ambiente
├── cypress/
│   ├── e2e/                  # Specs (cenários de teste), separados por domínio
│   │   ├── autenticacao/
│   │   │   └── login.cy.js
│   │   └── exemplo/
│   │       └── exemploCrud.cy.js
│   ├── fixtures/             # Massa de dados de teste (JSON, arquivos de upload…)
│   │   └── exemplo.json
│   ├── pages/                # Page Objects
│   │   ├── login/
│   │   │   ├── elements.js   # Seletores + mensagens esperadas
│   │   │   └── index.js      # Ações da página
│   │   ├── exemplo/          # Modelo de módulo CRUD
│   │   └── rotas/            # Asserções de URL/rota
│   └── support/
│       ├── commands.js       # Comandos customizados (cy.entrarNoApp, cy.irPara…)
│       └── e2e.js            # Configuração global
├── .github/workflows/        # Pipeline GitHub Actions
└── .gitlab-ci.yml            # Pipeline GitLab CI
```

---

## 🏗️ Arquitetura

O projeto é organizado em camadas, cada uma com uma única responsabilidade:

| Camada | Pasta | Responsabilidade |
| ------ | ----- | ---------------- |
| **Configuração** | `cypress.config.js` + `.env` | Define o ambiente ativo (`dev`/`prod`), a URL base, as credenciais, timeouts e relatórios. Nenhum dado sensível fica no código. |
| **Specs (cenários)** | `cypress/e2e/<dominio>/` | Descrevem **o que** é testado, no padrão AAA (Arrange / Act / Assert). Não contêm seletores nem detalhes de tela. |
| **Page Objects** | `cypress/pages/<pagina>/` | Descrevem **como** interagir com cada tela. `elements.js` guarda os seletores e textos esperados; `index.js` expõe as ações (preencher, salvar, excluir…). |
| **Rotas** | `cypress/pages/rotas/` | Centraliza as asserções de navegação (URL alcançada após cada ação). |
| **Comandos customizados** | `cypress/support/commands.js` | Ações transversais reutilizadas por qualquer spec: login (`cy.entrarNoApp`), navegação idempotente (`cy.irPara`), interceptação e validação de API (`cy.interceptarApi` / `cy.aguardarApi`). |
| **Massa de dados** | `cypress/fixtures/` | Dados de entrada dos testes em JSON, separados da lógica. |
| **CI/CD** | `.github/workflows/`, `.gitlab-ci.yml` | Execução automática em pipeline, com credenciais vindas de *secrets*. |

### Fluxo de um teste

```
Spec (e2e/)  ──►  Page Object (pages/)  ──►  Seletores (elements.js)
     │                    │
     │                    └──►  Comandos customizados (support/)
     │
     └──►  Asserções de rota (pages/rotas)      Dados ◄── fixtures/
                                                Config ◄── .env
```

1. O spec chama ações de alto nível (`exemplo.novoRegistro(...)`).
2. O Page Object executa a ação usando os seletores do `elements.js`.
3. Login, navegação e chamadas de API passam pelos comandos customizados.
4. O spec valida o resultado (registro na tabela, rota, mensagem).

Se um seletor mudar na aplicação, a correção é feita **em um único lugar** (`elements.js`), sem tocar nos specs.

---

## ⚙️ Instalação

```bash
git clone <url-do-seu-repositorio>
cd automation-testing-hub
npm install
```

---

## 🔐 Onde colocar URL, login e senha

1. Copie o modelo:

   ```bash
   cp .env.example .env
   ```

2. Preencha o `.env` com os dados do **seu** ambiente de teste:

   | Variável        | Descrição                                   |
   | --------------- | ------------------------------------------- |
   | `ENV`           | Ambiente padrão (`dev` ou `prod`)           |
   | `BASE_URL_DEV`  | URL da aplicação em desenvolvimento         |
   | `BASE_URL_PROD` | URL da aplicação em produção                |
   | `DEV_USER`      | Usuário de teste do ambiente dev            |
   | `DEV_PASSWORD`  | Senha do usuário de teste do ambiente dev   |
   | `PROD_USER`     | Usuário de teste do ambiente prod           |
   | `PROD_PASSWORD` | Senha do usuário de teste do ambiente prod  |

> ⚠️ O `.env` está no `.gitignore` e **nunca** deve ser commitado. Use sempre um usuário exclusivo para testes, nunca credenciais pessoais ou de clientes.

O `cypress.config.js` lê o `.env`, escolhe a URL/credenciais conforme `ENV` e as expõe para os testes via `Cypress.env("username")` e `Cypress.env("password")`.

---

## 🧩 Adaptando para a sua aplicação

1. **Seletores do login** → `cypress/pages/login/elements.js`
   Ajuste `emailInput`, `passwordInput`, `loginButton` e `areaLogada` (elemento que só aparece após logar).
2. **Mensagens esperadas** → objeto `mensagens` no mesmo arquivo.
3. **Rotas** → `cypress/pages/rotas/index.js`.
4. **Novos módulos** → copie `cypress/pages/exemplo/` e `cypress/e2e/exemplo/`, renomeie e ajuste os seletores.
5. **Massa de dados** → `cypress/fixtures/`.

> 💡 Prefira seletores dedicados a teste (`data-cy="..."`) — são mais estáveis que classes CSS ou textos.

---

## ▶️ Execução

| Comando                | Descrição                              |
| ---------------------- | -------------------------------------- |
| `npm run cy:open:dev`  | Abre a interface do Cypress em dev     |
| `npm run cy:open:prod` | Abre a interface do Cypress em prod    |
| `npm run cy:run:dev`   | Executa em modo headless em dev        |
| `npm run cy:run:prod`  | Executa em modo headless em prod       |

---

## 🚀 CI/CD

* **GitHub Actions:** `.github/workflows/cypress.yml` — cadastre `BASE_URL_DEV`, `DEV_USER` e `DEV_PASSWORD` em *Settings → Secrets and variables → Actions*.
* **GitLab CI:** `.gitlab-ci.yml` — cadastre as mesmas variáveis em *Settings → CI/CD → Variables* (marcadas como *Masked*).

---

## 📊 Relatórios e evidências

* Relatório HTML (Mochawesome) e JUnit: `cypress/reports/`
* Screenshots de falhas: `cypress/screenshots/`

---

## 💡 Boas práticas aplicadas

* Page Object Pattern (seletores separados das ações)
* Padrão AAA (Arrange / Act / Assert) nos specs
* Comandos customizados reutilizáveis e idempotentes
* Credenciais fora do código, por ambiente
* Separação de specs por domínio
* Asserções por URL/elemento em vez de esperas fixas
