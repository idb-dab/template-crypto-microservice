import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppService validation', () => {
  let appService: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root method validation', () => {
    it('should return "NestJS Skeleton Project" as app name', () => {
      expect(appService.getAppName()).toBe('NestJS Skeleton Project');
    });
  });
});
