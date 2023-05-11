import { HttpException, Injectable } from '@nestjs/common';
import { UserDbService } from 'src/db/user.service';
import { JwtTokenService } from 'src/helper/jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserDbService,
        private readonly jwtService: JwtTokenService
    ) { }

    async login(uid: string, name: string, email: string, avatar: string) {
        const [user, dbError] = await this.userService.updateOrCreateUser(uid, name, email, avatar);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return user;
    }

    async getCurrentUser(uid: string) {
        const [user, dbError] = await this.userService.getUserByUid(uid);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return user;
    }

    async getUser(id: string) {
        const [user, dbError] = await this.userService.getUser(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return user;
    }

    async deleteUser(id: string, uid: string) {
        const dbError = await this.userService.deleteUser(id, uid);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return null;
    }

    generateToken(payload: any) {
        const [token, jwtError] = this.jwtService.sign(payload);

        if (jwtError) {
            throw new HttpException(jwtError.message, jwtError.statusCode);
        }

        return token;
    }
}
