import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtTokenService } from 'src/helper/jwt.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {
    constructor(
        private readonly jwt: JwtTokenService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token =
            request.cookies?.['token'] || request.signedCookies?.['token'];
        if (!token) {
            return false;
        }

        const [user, jwtError] = this.jwt.verify(token);

        if (!user || jwtError) {
            return false;
        }

        request.user = user;

        return true;
    }
}
