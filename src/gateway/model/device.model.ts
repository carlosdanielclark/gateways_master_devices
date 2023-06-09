import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  @Prop({ required: true, unique: true })
  uid: number;

  @Prop({ required: true })
  vendor: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ enum: ['online', 'offline'], default: 'offline' })
  status: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);