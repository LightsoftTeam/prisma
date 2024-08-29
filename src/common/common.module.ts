import { Module } from '@nestjs/common';
import * as appInsights from 'applicationinsights';
import { CommonController } from './common.controller';
import { ApplicationLoggerService } from './services/application-logger.service';

@Module({
  providers: [
    {
      provide: 'ApplicationInsight',
      useFactory: () => {
          appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
          appInsights.start();
          return appInsights.defaultClient;
      }
  },
  ApplicationLoggerService
  ],
  controllers: [CommonController],
  exports: [ApplicationLoggerService]
})
export class CommonModule {}
