import winston from 'winston';
import { WinstonLogger } from './loggerServiceConfig.js';
import namespace from './config.js'; // Importe o namespace aqui também

export class LoggerService {
  private instance: winston.Logger;

  constructor(
    private readonly contextName: string,
    readonly logLevel = process.env.LOG_LEVEL || 'info',
    readonly stage = process.env.APP_STAGE || 'test',
    readonly serviceName = process.env.APPLICATION_NAME || 'app'
  ) {
    this.instance = winston.createLogger({
      levels: WinstonLogger.levels,
      defaultMeta: { service: serviceName }
    });

    const isTextMode = ['message', 'text'].includes(process.env.LOG_FORMAT || '');

    // FORMATO PARA DESENVOLVIMENTO (TEXTO/CORES)
    const textFormat = winston.format.combine(
      winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
      WinstonLogger.formatContext({ ctx: this.contextName, pad: 7 }),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service', 'correlationId', 'levelText'] }),
      WinstonLogger.formatPrint(this.stage)
    );

    // FORMATO PARA PRODUÇÃO (JSON/CLOUDWATCH)
    const jsonFormat = winston.format.combine(
      winston.format.timestamp(),
      WinstonLogger.formatContext({ ctx: this.contextName, pad: 0 }),
      // Garante que o correlationId esteja na raiz do JSON para o CloudWatch Insights
      winston.format((info) => {
        if (!info.correlationId && namespace.isActived()) {
          info.correlationId = namespace.getRequestId();
        }
        return info;
      })(),
      winston.format.json()
    );

    this.instance.add(new winston.transports.Console({
      level: this.logLevel,
      format: isTextMode ? textFormat : jsonFormat
    }));
  }

  // Métodos de log (info, error, debug, warn...)
  info(m: string, d?: any) { this.instance.info(m, d); }
  error(m: string, d?: any) { this.instance.error(m, d); }
  debug(m: string, d?: any) { this.instance.debug(m, d); }
  warn(m: string, d?: any) { this.instance.warn(m, d); }
  crit(m: string, d?: any) { this.instance.log('crit', m, d); }
}