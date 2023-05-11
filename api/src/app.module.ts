import { Module } from '@nestjs/common';
import { HelperModule } from './helper/helper.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [HelperModule, DbModule, AuthModule],
})
export class AppModule { }
