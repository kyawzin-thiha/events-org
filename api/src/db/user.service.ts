import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/helper/prisma.service';
import { UserDto } from 'src/types/database.dto';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class UserDbService {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        uid: string,
        name: string,
        email: string,
        avatar: string,
    ): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    uid,
                    name,
                    email,
                    avatar,
                },
            });
            return [user, null];
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return [null, { message: 'User already exists', statusCode: 400 }];
            }
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getUser(id: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                return [null, { message: 'User not found', statusCode: 404 }];
            }
            return [user, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getUserByUid(uid: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    uid,
                },
            });
            if (!user) {
                return [null, { message: 'User not found', statusCode: 404 }];
            }
            return [user, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getUserByEmail(email: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                return [null, { message: 'User not found', statusCode: 404 }];
            }
            return [user, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async updateOrCreateUser(
        uid: string,
        name: string,
        email: string,
        avatar: string,
    ): Promise<ErrorDto> {
        try {
            await this.prisma.user.upsert({
                where: {
                    uid,
                },
                update: {
                    name,
                    email,
                    avatar,
                },
                create: {
                    uid,
                    name,
                    email,
                    avatar,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async deleteUser(id: string, uid: string): Promise<ErrorDto> {
        try {
            await this.prisma.user.delete({
                where: {
                    id,
                    uid,
                }
            })
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }
}
