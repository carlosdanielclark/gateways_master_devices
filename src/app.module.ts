import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
     MongooseModule.forRoot('mongodb://127.0.0.1:27017/gateways_master_devices', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    GatewayModule,
  ],
})
export class AppModule {}
