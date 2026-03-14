cat << 'EOF' > README.md
# FlowLog 🚀

**FlowLog** é uma biblioteca de logging de alta performance para Node.js, construída sobre o [Winston](https://github.com/winstonjs/winston). Ela resolve o problema de rastreabilidade em sistemas assíncronos utilizando `AsyncLocalStorage` para manter um **Correlation ID** único durante todo o ciclo de vida de uma requisição.

---

## ✨ Características

- **Correlation ID Automático:** Rastreie logs de funções aninhadas e chamadas assíncronas sem passar IDs por parâmetro.
- **Dual Mode:** - **Text Mode:** Logs coloridos e formatados para humanos (ideal para desenvolvimento local no Linux/MacOS).
  - **JSON Mode:** Logs estruturados em uma única linha (ideal para AWS CloudWatch, Datadog e ELK).
- **Contextualização:** Adicione metadados e contextos (ex: `[ExpressApp]`) facilmente.
- **TypeScript Nativo:** Tipagem completa e suporte a ESM/CJS via `tsup`.

---

## 📦 Instalação

\`\`\`bash
npm install flowlog
\`\`\`

---

## 🚀 Como usar

### 1. Configuração no Express (Middleware)

Para que o \`correlationId\` funcione, você deve envolver suas rotas com o \`namespace.run\`.

\`\`\`javascript
import express from 'express';
import { randomUUID } from 'node:crypto';
import { LoggerService, namespace } from 'flowlog';

const app = express();
const logger = new LoggerService('ExpressApp', 'debug', 'development', 'api-service');

app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();

  namespace.run({ requestId: correlationId }, () => {
    next();
  });
});
\`\`\`

### 2. Uso em Funções Assíncronas

\`\`\`javascript
import { LoggerService } from 'flowlog';
const logger = new LoggerService('Database');

async function saveToDb() {
  // O ID é recuperado automaticamente do contexto
  logger.info('Salvando dados no banco de dados...');
}
\`\`\`

---

## 🛠️ Configuração via Variáveis de Ambiente

| Variável | Valores | Descrição |
| :--- | :--- | :--- |
| \`LOG_FORMAT\` | \`text\` \| \`json\` | Define se o log será colorido (text) ou JSON estruturado. |
| \`LOG_LEVEL\` | \`debug\`, \`info\`, \`warn\`, \`error\` | Nível mínimo de log. |
| \`APP_STAGE\` | \`development\`, \`production\`, \`test\` | Prefixo do ambiente. |

---

## 🏗️ Pipeline de CI/CD

Esta biblioteca está configurada para deploy automático no NPM via GitHub Actions ao detectar uma nova tag:

1. Atualize a versão no \`package.json\`.
2. \`git tag v1.0.0\`
3. \`git push origin v1.0.0\`

---

## 📄 Licença

Distribuído sob a licença MIT.
EOF