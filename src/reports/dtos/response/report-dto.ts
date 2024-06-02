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

  @Expose()
  approved: boolean;

  @Transform((params) => params.obj.user.id)
  @Expose()
  userId: number;

  // NOTE if updateApprovedStatus wants to use this DTO,
  // you need to query the user entity to get the user's id
}
