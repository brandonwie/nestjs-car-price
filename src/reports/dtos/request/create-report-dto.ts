import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  model: string;

  @IsString()
  make: string;

  @IsInt()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsInt()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}
