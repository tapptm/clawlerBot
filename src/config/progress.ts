import { SingleBar } from 'cli-progress';

export class ProgressBar extends SingleBar {
  constructor() {
    super({
      format: 'progress: [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    });
  }
}
