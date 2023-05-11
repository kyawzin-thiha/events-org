import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/helper/prisma.service";
import { OrderDetailDto, OrdersDto } from "src/types/database.dto";
import { ErrorDto } from "src/types/error.dto";

@Injectable()
export class OrderDbService {
    constructor(private readonly prisma: PrismaService) { }

    async create(owner: string, event: string, ticket: string): Promise<ErrorDto> {
        try {
            await this.prisma.order.create({
                data: {
                    ticket,
                    owner: {
                        connect: {
                            id: owner,
                        }
                    },
                    event: {
                        connect: {
                            id: event,
                        }
                    }

                }
            })
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async getAllOrder(owner: string): Promise<[OrdersDto, ErrorDto]> {
        try {
            const orders = await this.prisma.order.findMany({
                where: {
                    owner: {
                        id: owner,
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    event: true,
                }
            })
            return [orders, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getOrder(owner: string, order: string): Promise<[OrderDetailDto, ErrorDto]> {
        try {
            const orderDetail = await this.prisma.order.findUnique({
                where: {
                    id: order,
                    owner: {
                        id: owner,
                    }
                },
                include: {
                    event: true,
                    owner: true,
                }
            })
            return [orderDetail, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }
}