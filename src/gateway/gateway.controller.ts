import { Controller, Get, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DeviceDto } from './dto/device.dto';
import { GatewayDto } from './dto/gateway.dto';

@Controller('gateways')
@ApiTags('Gateways')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Gateway created successfully' })
  async createGateway(@Body() gatewayDto: GatewayDto): Promise<GatewayDto> {
    return this.gatewayService.createGateway(gatewayDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all gateways' })
  async getAllGateways(): Promise<GatewayDto[]> {
    return this.gatewayService.getAllGateways();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Returns a single gateway' })
  @ApiResponse({ status: 404, description: 'Gateway not found' })
  async getGatewayById(@Param('id') id: string): Promise<GatewayDto> {
    return this.gatewayService.getGatewayById(id);
  }

  @Post(':id/devices')
  @ApiResponse({ status: 201, description: 'Device added successfully' })
  @ApiResponse({ status: 400, description: 'Maximum number of devices reached' })
  async addDeviceToGateway(
    @Param('id') gatewayId: string,
    @Body() deviceDto: DeviceDto,
  ): Promise<GatewayDto> {
    const device = {
      ...deviceDto,
      createdDate: new Date(),
    };
    return this.gatewayService.addDeviceToGateway(gatewayId, device);
  }

  @Delete(':id/devices/:deviceId')
  @ApiResponse({ status: 200, description: 'Device removed successfully' })
  @ApiResponse({ status: 404, description: 'Gateway or device not found' })
  async removeDeviceFromGateway(
    @Param('id') gatewayId: string,
    @Param('deviceId') deviceId: string,
  ): Promise<GatewayDto> {
    return this.gatewayService.removeDeviceFromGateway(gatewayId, deviceId);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Gateway deleted successfully' })
  @ApiResponse({ status: 404, description: 'Gateway not found' })
  async deleteGateway(@Param('id') id: string): Promise<void> {
    await this.gatewayService.deleteGateway(id);
  }

  /*@Put(':id')
  @ApiResponse({ status: 200, description: 'Gateway updated successfully' })
  @ApiResponse({ status: 404, description: 'Gateway not found' })
  async updateGateway(
    @Param('id') id: string,
    @Body() gatewayDto: GatewayDto,
  ): Promise<GatewayDto> {
    return this.gatewayService.updateGateway(id, gatewayDto);
  }*/
}
