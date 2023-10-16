import { SingleBar } from 'cli-progress';
import { green, greenBright, grey, yellow, bgYellow, blue } from 'ansi-colors';

export class ProgressBar extends SingleBar {
  constructor(protected context: string, protected dateFormat = new Date().toLocaleString()) {
    super({
      format: `${blue('[DUBUG]')} ${dateFormat} - ${yellow(`[${context}]`)} 🚀 ${greenBright('{bar}')} {percentage}% | ETA: {eta}s | Chunks {value}/{total}`
    });
  }
}
