import { Module } from '@nestjs/common';
import { TaboosController } from './taboos.controller';
import { TaboosService } from './taboos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Taboos } from './taboos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Taboos])],
  controllers: [TaboosController],
  providers: [TaboosService],
})
export class TaboosModule {}
