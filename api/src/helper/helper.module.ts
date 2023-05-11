import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseAdminService } from './firebase.service';
import { JwtTokenService } from './jwt.service';
import { AwsService } from './aws.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [PrismaService, FirebaseAdminService, JwtTokenService, AwsService],
    exports: [PrismaService, FirebaseAdminService, JwtTokenService, AwsService],
})
export class HelperModule { }
