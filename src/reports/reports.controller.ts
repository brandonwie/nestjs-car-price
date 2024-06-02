import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/request/create-report-dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentUser } from '@/users/decorators/current-user.decorator';
import { User } from '@/users/user.entity';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/response/create-report-dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(user, body);
  }
}
