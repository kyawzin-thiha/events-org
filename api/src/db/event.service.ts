import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/helper/prisma.service";
import { EventDetailDto, EventsDto } from "src/types/database.dto";
import { ErrorDto } from "src/types/error.dto";

@Injectable()
export class EventDbService {
    constructor(private readonly prisma: PrismaService) { }

    async create(owner: string, name: string, slug: string, excerpt: string, content: string, thumbnail: string, tickets: { name: string, price: number }[]): Promise<[EventDetailDto, ErrorDto]> {
        try {
            const event = await this.prisma.event.create({
                data: {
                    name,
                    slug,
                    excerpt,
                    content,
                    thumbnail,
                    owner: {
                        connect: {
                            id: owner
                        }
                    },
                    tickets: {
                        createMany: {
                            data: tickets
                        }
                    },
                },
                include: {
                    tickets: true,
                }
            })
            return [event, null];
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return [null, { message: 'Duplicated event slug already exists', statusCode: 400 }];
            }
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getAll(): Promise<[EventsDto, ErrorDto]> {
        try {
            const events = await this.prisma.event.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return [events, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getEvent(slug: string): Promise<[EventDetailDto, ErrorDto]> {
        try {
            const event = await this.prisma.event.findUnique({
                where: {
                    slug,
                },
                include: {
                    tickets: true,
                }
            });
            if (!event) {
                return [null, { message: 'Event not found', statusCode: 404 }];
            }
            return [event, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getEventById(id: string): Promise<[EventDetailDto, ErrorDto]> {
        try {
            const event = await this.prisma.event.findUnique({
                where: {
                    id,
                },
                include: {
                    tickets: true,
                }
            });
            if (!event) {
                return [null, { message: 'Event not found', statusCode: 404 }];
            }
            return [event, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getEventsByOwner(owner: string): Promise<[EventsDto, ErrorDto]> {
        try {
            const events = await this.prisma.event.findMany({
                where: {
                    owner: {
                        id: owner
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return [events, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getAllSlugs(): Promise<[string[], ErrorDto]> {
        try {
            const events = await this.prisma.event.findMany({
                select: {
                    slug: true
                }
            })
            return [events.map(event => event.slug), null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async update(owner: string, event: string, name: string, excerpt: string, content: string, thumbnail: string): Promise<ErrorDto> {
        try {
            await this.prisma.event.update({
                where: {
                    id: event,
                    owner: {
                        id: owner
                    }
                },
                data: {
                    name,
                    excerpt,
                    content,
                    thumbnail
                }
            })
            return null;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return { message: 'Event slug duplication error occur', statusCode: 400 };
            }
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async updateTicket(owner: string, event: string, tickets: { id?: string, name: string, price: number }[]): Promise<ErrorDto> {
        try {
            const upsertOperation = tickets.map(ticket => {
                return this.prisma.ticket.upsert({
                    where: {
                        id: ticket.id,
                        event: {
                            id: event,
                            owner: {
                                id: owner
                            }
                        }
                    },
                    update: {
                        name: ticket.name,
                        price: ticket.price,
                    },
                    create: {
                        name: ticket.name,
                        price: ticket.price,
                        event: {
                            connect: {
                                id: event,
                            }
                        }
                    }
                })
            })

            await this.prisma.$transaction(upsertOperation);
            return null;
        } catch (error) {
            console.log(error)
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async deleteTicket(owner: string, event: string, tickets: string[]): Promise<ErrorDto> {
        try {
            await this.prisma.ticket.deleteMany({
                where: {
                    id: {
                        in: tickets
                    },
                    event: {
                        id: event,
                        owner: {
                            id: owner,
                        }
                    },
                }
            })
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async delete(owner: string, event: string): Promise<ErrorDto> {
        try {
            await this.prisma.event.delete({
                where: {
                    id: event,
                    owner: {
                        id: owner,
                    }
                }
            })
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }
}