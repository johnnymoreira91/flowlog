import { inspect } from 'node:util';
import * as winston from 'winston';
import namespace from './config.js';

export const logColors = {
  crit: '\x1b[1m\x1b[31m',
  alert: '\x1b[1m\x1b[36m',
  http: '\x1b[1m\x1b[34m',
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[32m',
  debug: '\x1b[35m',
  verbose: '\x1b[2m',
  reset: '\x1b[0m',
  yellow_prefix: '\x1b[33m'
};

export class WinstonLogger {
  static levels = {
    crit: 0, alert: 1, http: 2, error: 3, warn: 4, info: 5, debug: 6, verbose: 7
  };

  static parsePascalCase = (label?: string) => {
    return label
      ? label.replace(/[_\-\s]+/g, ' ').replace(/(^\w|\b\w)/g, (m) => m.toUpperCase()).replace(/\s+/g, '')
      : undefined;
  };

  static formatContext = winston.format((info, opts: any) => {
    if (namespace.isActived()) {
      info.correlationId = namespace.getRequestId();
    }

    // Adiciona o contexto à mensagem se existir
    const contextStr = opts?.ctx ? `(${opts.ctx}) ` : '';
    info.message = `${contextStr}${info.message}`;

    // Cria o texto do level alinhado
    info.levelText = info.level.toUpperCase().padStart(opts?.pad || 0);
    return info;
  });

  static formatPrint(stage: string) {
    return winston.format.printf((info) => {
      // O Winston coloca metadados em info.metadata se o format.metadata() for usado
      const { correlationId, timestamp, levelText, message, service, metadata } = info;

      const levelKey = info[Symbol.for('level')] as keyof typeof logColors;
      const color = logColors[levelKey] || '';

      const puid = String(correlationId || process.pid).slice(-7).padEnd(7, ' ');
      const appPrefix = `[${WinstonLogger.parsePascalCase(stage + '-' + (service || 'app'))}]`;

      // Montagem da linha principal
      let logMsg = `${logColors.yellow_prefix}${appPrefix} ${puid}${logColors.reset} - ` +
        `${timestamp} ${color}${levelText}${logColors.reset} ${message}`;

      // Se houver dados extras (metadata), usamos o inspect
      if (['crit', 'error', 'debug'].includes(levelKey) && metadata && Object.keys(metadata).length > 0) {
        logMsg += '\n' + inspect(metadata, { depth: 4, colors: true, maxStringLength: 100 });
      }

      return logMsg;
    });
  }
}