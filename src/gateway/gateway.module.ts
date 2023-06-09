import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { DeviceSchema } from './model/device.model';
import { GatewaySchema } from './model/gateway.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Gateway', schema: GatewaySchema },
      { name: 'Device', schema: DeviceSchema },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
