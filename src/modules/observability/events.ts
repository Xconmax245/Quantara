// ============================================================
// Event Emitter Module — Protocol Event Architecture
// ============================================================

import type { EventType, TransactionEvent } from '@/types';
import { generateId, getTimestamp } from '@/lib/utils';

type EventHandler = (event: TransactionEvent) => void;

class ProtocolEventEmitter {
  private static instance: ProtocolEventEmitter;
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private globalHandlers: Set<EventHandler> = new Set();
  private eventLog: TransactionEvent[] = [];

  static getInstance(): ProtocolEventEmitter {
    if (!ProtocolEventEmitter.instance) {
      ProtocolEventEmitter.instance = new ProtocolEventEmitter();
    }
    return ProtocolEventEmitter.instance;
  }

  on(type: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  onAny(handler: EventHandler): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  emit(type: EventType, payload: Record<string, unknown> = {}): TransactionEvent {
    const event: TransactionEvent = {
      id: generateId('EVT'),
      type,
      payload,
      timestamp: getTimestamp(),
    };

    this.eventLog.push(event);

    // Notify type-specific handlers
    this.handlers.get(type)?.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Event handler error for ${type}:`, error);
      }
    });

    // Notify global handlers
    this.globalHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error('Global event handler error:', error);
      }
    });

    return event;
  }

  getLog(limit: number = 100): TransactionEvent[] {
    return this.eventLog.slice(-limit);
  }

  getLogByType(type: EventType, limit: number = 50): TransactionEvent[] {
    return this.eventLog.filter((e) => e.type === type).slice(-limit);
  }

  clear(): void {
    this.handlers.clear();
    this.globalHandlers.clear();
    this.eventLog = [];
  }
}

export const eventEmitter = ProtocolEventEmitter.getInstance();
