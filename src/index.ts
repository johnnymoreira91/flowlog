// import namespace from "./application/config.js";
// import { LoggerService } from "./application/loggerService.js";
// import { WinstonLogger } from "./application/loggerServiceConfig.js";


// export { LoggerService };

// export { namespace };

// export type { WinstonLogger };

// export default LoggerService;

// export const createLogger = (context: string) => {
//   return new LoggerService(context);
// };
// src/index.ts
import namespace from "./application/config.js";
import { LoggerService } from "./application/loggerService.js";
import { WinstonLogger } from "./application/loggerServiceConfig.js";

// Exporte explicitamente por nome
export { LoggerService, namespace, WinstonLogger };

// Se quiser manter uma factory
export const createLogger = (context: string) => {
  return new LoggerService(context);
};