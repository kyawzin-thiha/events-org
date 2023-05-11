import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseAdminService } from './firebase.service';
import { JwtTokenService } from './jwt.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [PrismaService, FirebaseAdminService, JwtTokenService],
    exports: [PrismaService, FirebaseAdminService, JwtTokenService],
})
export class HelperModule { }
