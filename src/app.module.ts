import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { WinstonLoggerModule } from '@idb-dab/ms-logger';
import { StatusModule } from './status/status.module';
import { EncryptDecryptModule } from '@idb-dab/ms-crypt';
import configuration, { CONSTANTS } from './common/config/configuration';
import { GlobalHttpServiceUtil } from '@idb-dab/ms-utils';

@Module({
  imports: [
    // Import ConfigModule with global config. No need to import in other modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Import CoreModule with global config. If you need to set different labels in different modules,
    // then you can import in other modules with correct label set.
    // CoreModule.forRoot({ loggerLabel: CONSTANTS.LOG.LABEL }),
    // Using common Library
    WinstonLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        loggerLabel: CONSTANTS.LOG.LABEL,
        configService: configService,
      }),
      inject: [ConfigService],
    }),
    // For adding encrypt-decrypt service
    EncryptDecryptModule.forRootSnsAsync(),
    // Enable cache Module
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('app.cache.ttl'),
        max: configService.get('app.cache.maxCount'),
      }),
      inject: [ConfigService],
    }),
    // Global HTTP module
    GlobalHttpServiceUtil,
    StatusModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        if (configService.get('app.environment') === CONSTANTS.ENV.PRODUCTION) {
          const mongoConnectionObject = configService.get('database.mongodb')
          console.log(`MongoDB connection settings [URI: ${mongoConnectionObject.uri}]`)
          return mongoConnectionObject
        }
        const { MongoMemoryReplSet } = require('mongodb-memory-server'); // eslint-disable-line
        const mongoMemoryReplicaSetServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
        console.log(`MongoDB-In-Memory server available at URI: ${mongoMemoryReplicaSetServer.getUri()}`);
        return {
          uri: mongoMemoryReplicaSetServer.getUri(),
          useNewUrlParser: configService.get('database.mongodb.useNewUrlParser'),
          useUnifiedTopology: configService.get('database.mongodb.useUnifiedTopology'),
          serverSelectionTimeoutMS: configService.get('database.mongodb.serverSelectionTimeoutMS'),
          connectTimeoutMS: configService.get('database.mongodb.connectTimeoutMS'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
