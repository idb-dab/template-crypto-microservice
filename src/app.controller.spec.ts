import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController validation', () => {
  let appController: AppController;
  let appService: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root method validation', () => {
    it('should return "NestJS Skeleton Project" as app name', () => {
      jest.spyOn(appService, 'getAppName').mockReturnValueOnce('NestJS Skeleton Project');
      expect(appController.getAppName()).toBe('NestJS Skeleton Project');
    });
  });
});