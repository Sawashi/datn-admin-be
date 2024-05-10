import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection } from './collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionDto } from './dto/collectionData.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, CollectionDto])],
  providers: [CollectionService, CloudinaryService],
  controllers: [CollectionController],
})
export class CollectionModule {}
