import { IsNumber, IsString, IsNotEmpty, IsEnum, IsDate, isNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeviceDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'uid is required' })
  @IsNumber()  
  uid: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'vendor is required' })
  @IsString({ message: 'Invalid format' })
  vendor: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'createdDate is required' })
  @IsDate() 
  createdDate: Date;

  @ApiProperty({ enum: ['online', 'offline'], default: 'offline' })
  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(['online', 'offline']) 
  status: string;
}