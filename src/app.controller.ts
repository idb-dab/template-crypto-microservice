import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Get the name of the application.
   *
   * @returns The name of the application.
   */
  @Get()
  getAppName(): string {
    return this.appService.getAppName();
  }
}
