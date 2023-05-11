import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from 'src/helper/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly firebase: FirebaseAdminService) { }

    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader) {
            return false;
        }

        const [bearer, token] = authorizationHeader.split(' ');

        if (bearer.toLowerCase() !== 'bearer' || !token) {
            return false;
        }

        return this.validateToken(request, token);
    }

    async validateToken(req: any, token: string) {
        try {
            const decodedToken = await this.firebase
                .getInstance()
                .auth()
                .verifyIdToken(token);

            req.firebaseUser = decodedToken;

            return true;
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid Token');
        }
    }
}
