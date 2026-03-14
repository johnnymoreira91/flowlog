// namespace.ts
import { AsyncLocalStorage } from 'node:async_hooks';

interface LogContext {
  requestId?: string;
  keyId?: string;
}

export class Namespace {
  private readonly storage = new AsyncLocalStorage<LogContext>();

  isActived(): boolean {
    return !!this.storage.getStore();
  }

  // No AsyncLocalStorage, usamos o método 'run' para envolver a requisição
  run(context: LogContext, callback: () => void) {
    this.storage.run(context, callback);
  }

  getRequestId<T>(): T | undefined {
    return this.storage.getStore()?.requestId as T;
  }

  getkeyId<T>(): T | undefined {
    return this.storage.getStore()?.keyId as T;
  }
}

export const namespace = new Namespace();
export default namespace;