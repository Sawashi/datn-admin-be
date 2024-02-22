import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {
    reportsRepository: reportsRepository;
  }
  // get all reports
  async findAll(): Promise<Report[]> {
    return await this.reportsRepository.find();
  }
  // get one report
  async findOne(id: number): Promise<Report> {
    return await this.reportsRepository.findOne({ where: { id } });
  }

  //create report
  async create(report: Report): Promise<Report> {
    const newReport = this.reportsRepository.create(report);
    return await this.reportsRepository.save(newReport);
  }

  // update report
  async update(id: number, report: Report): Promise<Report> {
    await this.reportsRepository.update(id, report);
    return await this.reportsRepository.findOne({ where: { id } });
  }

  // delete report
  async delete(id: number): Promise<void> {
    await this.reportsRepository.delete(id);
  }
}
