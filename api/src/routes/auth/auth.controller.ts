import { LocalAuthGuard } from 'src/guards/local.guard';
import { AuthService } from './auth.service';
import { Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth Module")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('re-authenticate')
    async reAuthenticate() {
        return;
    }

    @UseGuards(FirebaseAuthGuard)
    @Post('login')
    async login(@Request() req, @Response({ passthrough: true }) res) {
        const firebaseUser = req.firebaseUser;
        const user = await this.authService.login(
            firebaseUser.uid,
            firebaseUser.name,
            firebaseUser.email,
            firebaseUser.picture,
        );

        const token = this.authService.generateToken({
            id: user.id,
            uid: user.uid,
        });

        res.cookie('token', token, {
            signed: process.env.NODE_ENV === 'production',
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            domain:
                process.env.NODE_ENV === 'production'
                    ? process.env.WEB_DOMAIN
                    : 'localhost',
            maxAge: 60 * 60 * 24 * 7 * 1000,
        });

        return;
    }

    @UseGuards(LocalAuthGuard)
    @Get('/user')
    async getUser(@Request() req) {
        const { id } = req.user;

        return await this.authService.getUser(id);
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Response({ passthrough: true }) res) {
        res.clearCookie('token', {
            signed: process.env.NODE_ENV === 'production',
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            domain:
                process.env.NODE_ENV === 'production'
                    ? process.env.WEB_DOMAIN
                    : 'localhost',
            maxAge: 60 * 60 * 24 * 7 * 1000,
        });
    }
}
