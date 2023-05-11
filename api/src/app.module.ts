import { INestApplication, Module } from '@nestjs/common';
import { HelperModule } from './helper/helper.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './routes/auth/auth.module';
import { EventModule } from './routes/event/event.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [SwaggerModule, HelperModule, DbModule, AuthModule, EventModule],
})
export class AppModule {
  static setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle('Event Management API')
      .setDescription('This is starter api for event management and ticketing system')
      .setVersion('1.0')
      .addTag('Auth Module', 'Endpoints for user authentications')
      .addTag('Events Module', 'Endpoints for events organizing and ticketing')
      .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [AuthModule, EventModule], // Specify the modules to include in Swagger documentation
    });

    SwaggerModule.setup('api', app, document);
  }
}