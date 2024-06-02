import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/request/create-report-dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentUser } from '@/users/decorators/current-user.decorator';
import { User } from '@/users/user.entity';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/response/report-dto';
import { ApproveReportDto } from './dtos/request/approve-report-dto';
import { AdminGuard } from '@/guards/admin.guard';
import { GetEstimateDto } from './dtos/request/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(user, body);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateApproval(@Param('id') id: string, @Body() body: ApproveReportDto) {
    console.log(id);
    return this.reportsService.approveReport(parseInt(id), body.approved);
  }

  @Get()
  @UseGuards(AuthGuard)
  getEstimate(@Query() query: GetEstimateDto) {}
}
