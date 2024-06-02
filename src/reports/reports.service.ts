import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/request/create-report-dto';
import { User } from '@/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(user: User, data: CreateReportDto) {
    const report = this.repo.create(data);
    report.user = user;

    // associate the report with the user who requested it

    return this.repo.save(report);
  }

  async approveReport(id: number, approved: boolean) {
    const report = await this.repo.findOne({ where: { id } });

    console.log(report);

    if (report === undefined) {
      throw new NotFoundException('report not found');
    }
    // won't perform save() unless the value is different
    if (report.approved === approved) {
      return report;
    }

    report.approved = approved;

    return this.repo.save(report);
  }
}
