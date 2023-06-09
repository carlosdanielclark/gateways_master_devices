import { IsString, IsNotEmpty, IsIP, IsArray, IsEmail } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { DeviceDto } from './device.dto';

export class GatewayDto {
  @ApiHideProperty()
  _id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'serialNumber is required' })
  @IsString({ message: 'Invalid format' })
  serialNumber: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'Invalid format' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'ipv4Address is required' })
  @IsString({ message: 'Invalid format' })
  @IsEmail()  
  ipv4Address: string;

  @ApiProperty({ type: () => DeviceDto, isArray: true })
  @IsArray()
  peripheralDevices: DeviceDto[];
}
