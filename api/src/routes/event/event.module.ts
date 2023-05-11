import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { HelperModule } from 'src/helper/helper.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [HelperModule, DbModule],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule { }
