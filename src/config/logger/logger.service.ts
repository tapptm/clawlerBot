import { LoggerService, Logger } from '@nestjs/common';
import { blue, green, greenBright, grey, red, yellow,  } from 'ansi-colors';

export class CustomLogger implements LoggerService {
  constructor(private topic: string) {
    this.topic = topic;
  }

  private dateFormat = new Date().toLocaleString();
  
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(`${green('[LOG]')} ${this.dateFormat} - ${yellow(`[${this.topic}]`)}`, message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(`${red('[ERROR]')} ${this.dateFormat} - ${yellow(`[${this.topic}]`)}`, message , optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(`${yellow('[WARN]')} ${this.dateFormat} - ${yellow(`[${this.topic}]`)}`, message );
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.log(`${blue('[DUBUG]')} ${this.dateFormat} - ${yellow(`[${this.topic}]`)}`, message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
}
