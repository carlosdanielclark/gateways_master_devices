// GatewayService

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GatewayDto } from './dto/gateway.dto';
import { DeviceDto } from './dto/device.dto';
import { Gateway } from './model/gateway.model';
import { Device } from './model/device.model';

@Injectable()
export class GatewayService {
  constructor(
    @InjectModel('Gateway') private readonly gatewayModel: Model<Gateway>,
    @InjectModel('Device') private readonly deviceModel: Model<Device>,
  ) {}

  async createGateway(gatewayDto: GatewayDto): Promise<GatewayDto> {
    const existingGateway = await this.gatewayModel
      .findOne({ serialNumber: gatewayDto.serialNumber })
      .exec();      
    if (existingGateway) {
      throw new BadRequestException('Serial number already exists');
    }
  
    const existingGatewayByName = await this.gatewayModel
      .findOne({ name: gatewayDto.name })
      .exec();
    if (existingGatewayByName) {
      throw new BadRequestException('Name already exists');
    }
  
    const existingGatewayByIpv4 = await this.gatewayModel
      .findOne({ ipv4Address: gatewayDto.ipv4Address })
      .exec();
    if (existingGatewayByIpv4) {
      throw new BadRequestException('IPv4 address already exists');
    }
  
    if (gatewayDto.peripheralDevices.length >= 10) {
      throw new BadRequestException('Maximum number of devices reached');
    }
  
    const peripheralDevices = gatewayDto.peripheralDevices.map(
      deviceDto => new this.deviceModel(deviceDto)
    );
    const peripheralDeviceDocuments = await this.deviceModel.create(
      peripheralDevices
    );
  
    const gateway = new this.gatewayModel({
      ...gatewayDto,
      peripheralDevices: peripheralDeviceDocuments.map(device => device._id),
    });
  
    await gateway.validate();
    await gateway.save();
  
    return gateway.toObject();
  } 

  async getAllGateways(): Promise<GatewayDto[]> {
    const gateways = await this.gatewayModel.find().exec();
    const gatewayDtos: GatewayDto[] = [];
  
    for (const gateway of gateways) {
      const peripheralDevices = await this.deviceModel.find({ _id: { $in: gateway.peripheralDevices } }).exec();
      const deviceDtos = peripheralDevices.map(device => ({
        uid: device.uid,
        vendor: device.vendor,
        createdDate: device.createdDate,
        status: device.status,
      }));
      
      const gatewayDto: GatewayDto = {
        _id: gateway._id.toString(),
        serialNumber: gateway.serialNumber,
        name: gateway.name,
        ipv4Address: gateway.ipv4Address,
        peripheralDevices: deviceDtos,
      };
  
      gatewayDtos.push(gatewayDto);
    }
  
    return gatewayDtos;
  }
  

  async getGatewayById(id: string): Promise<GatewayDto> {
    const gateway = await this.gatewayModel.findById(id).exec();
    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    }
    const peripheralDevices = await this.deviceModel.find({ _id: { $in: gateway.peripheralDevices } }).exec();
      const deviceDtos = peripheralDevices.map(device => ({
        uid: device.uid,
        vendor: device.vendor,
        createdDate: device.createdDate,
        status: device.status,
      }));
      
      const gatewayDto: GatewayDto = {
        _id: gateway._id.toString(),
        serialNumber: gateway.serialNumber,
        name: gateway.name,
        ipv4Address: gateway.ipv4Address,
        peripheralDevices: deviceDtos,
      };
      return gatewayDto;
  }

  async addDeviceToGateway(
    gatewayId: string,
    deviceDto: DeviceDto,
  ): Promise<GatewayDto> {
    const gateway = await this.gatewayModel.findById(gatewayId).exec();
    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    }

    if (gateway.peripheralDevices.length >= 10) {
      throw new BadRequestException('Maximum number of devices reached');
    }

    const device = new this.deviceModel(deviceDto);
    await device.validate();
    await device.save();

    gateway.peripheralDevices.push(device._id);
    await gateway.save();
    return gateway.toObject() as GatewayDto;
  }

  async removeDeviceFromGateway(
    gatewayId: string,
    deviceId: string,
  ): Promise<GatewayDto> {
    const gateway = await this.gatewayModel.findById(gatewayId).exec();
    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    }

    const deviceIndex = gateway.peripheralDevices.findIndex(
      (device) => device._id.toString() === deviceId,
    );

    if (deviceIndex === -1) {
      throw new NotFoundException('Device not found');
    }

    gateway.peripheralDevices.splice(deviceIndex, 1);
    await gateway.save();
    return gateway.toObject();
  }

  async deleteGateway(id: string): Promise<void> {
    const gateway = await this.gatewayModel.findById(id).exec();
    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    }

    const peripheralDevices = gateway.peripheralDevices;
    for (const deviceId of peripheralDevices) {
      await this.deviceModel.findByIdAndDelete(deviceId).exec();
    }
  
    await this.gatewayModel.findByIdAndDelete(id).exec();
  }
  

  async updateGateway(id: string, gatewayDto: GatewayDto): Promise<GatewayDto> {
    const gateway = await this.gatewayModel.findById(id).exec();
    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    }
    gateway.name = gatewayDto.name;
    gateway.ipv4Address = gatewayDto.ipv4Address;
    await gateway.validate();
    await gateway.save();
    return gateway.toObject() as GatewayDto;
  }
}
