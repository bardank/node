import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CalcController } from './calc.controller';
import { CalcService } from './calc.service';
import { LoggingMiddleware } from '../MIddlewares/logging.middleware';
@Module({
  controllers: [CalcController],
  providers: [CalcService],
})
export class CalcModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
