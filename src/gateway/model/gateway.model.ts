import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Device, DeviceSchema } from './device.model';

export type GatewayDocument = Gateway & Document;

@Schema()
export class Gateway {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ipv4Address: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Device' }] })
  peripheralDevices: Types.ObjectId[];
}

export const GatewaySchema = SchemaFactory.createForClass(Gateway);
