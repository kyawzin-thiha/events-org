import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class JwtTokenService {
	constructor(private readonly jwtService: JwtService) { }

	sign(payload: any, expiresIn = '7d'): [string | null, ErrorDto] {
		try {
			const token = this.jwtService.sign(payload, {
				expiresIn,
			});
			return [token, null];
		} catch (error) {
			return [null, { message: 'Internal server error', statusCode: 500 }];
		}
	}

	verify(token: string): [any, ErrorDto] {
		try {
			const data = this.jwtService.verify(token);
			return [data, null];
		} catch (error) {
			return [null, { message: 'Internal server error', statusCode: 500 }];
		}
	}
}
