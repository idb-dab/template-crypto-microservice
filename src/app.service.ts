import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Get the name of the application.
   *
   * @returns The name of the application.
   */
  getAppName(): string {
    return 'NestJS Skeleton Project';
  }
}
