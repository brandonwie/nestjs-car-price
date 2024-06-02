import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/request/create-report-dto';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>,
    private usersService: UsersService,
  ) {}

  async create(user: User, data: CreateReportDto) {
    const report = this.repo.create(data);
    report.user = user;

    // associate the report with the user who requested it

    return this.repo.save(report);
  }
}
