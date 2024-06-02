import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreateReportDto } from './dto/createReportDto.dto';

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

  async getReportsForUser(user: User): Promise<Report[]> {
    return await this.reportsRepository.find({
      where: {
        userId: user.id,
      },
    });
  }
  // get one report
  async findOne(id: number): Promise<Report> {
    return await this.reportsRepository.findOne({ where: { id } });
  }

  async isUserReported(userId: number, dishId: number): Promise<boolean> {
    const userCollection = await this.reportsRepository.findOne({
      where: { user: { id: userId }, dish: { id: dishId } },
    });
    return !!userCollection;
  }

  async create(reportDto: CreateReportDto): Promise<Report> {
    const { userId, content, status, dishId } = reportDto;
    const exists = await this.isUserReported(userId, dishId);
    if (exists) {
      throw new Error('Report sent');
    }
    const newReport = this.reportsRepository.create({
      userId,
      content,
      status,
      dishId,
    });
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

  // get review by userId
  async findReportByUserIdAndDish(
    userId: number,
    dishId: number,
  ): Promise<Report[]> {
    return await this.reportsRepository.find({
      where: { user: { id: userId }, dish: { id: dishId } },
    });
  }
}
