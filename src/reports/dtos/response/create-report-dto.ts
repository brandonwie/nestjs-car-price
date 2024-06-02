import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  model: string;

  @Expose()
  make: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  price: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Transform((params) => params.obj.user.id)
  @Expose()
  userId: number;
}
