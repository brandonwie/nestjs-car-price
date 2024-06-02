import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  model: string;

  @IsString()
  make: string;

  @Transform((params) => parseInt(params.value))
  @IsInt()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform((params) => parseInt(params.value))
  @IsInt()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform((params) => parseInt(params.value))
  @IsLongitude()
  lng: number;

  @Transform((params) => parseInt(params.value))
  @IsLatitude()
  lat: number;
}
