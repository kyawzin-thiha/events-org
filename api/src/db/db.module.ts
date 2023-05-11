import { Module } from '@nestjs/common';
import { HelperModule } from 'src/helper/helper.module';
import { UserDbService } from './user.service';
import { EventDbService } from './event.service';
import { OrderDbService } from './order.module';

@Module({
    imports: [HelperModule],
    providers: [UserDbService, EventDbService, OrderDbService],
    exports: [UserDbService, EventDbService, OrderDbService],
})
export class DbModule { }
