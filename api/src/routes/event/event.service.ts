import { HttpException, Injectable } from '@nestjs/common';
import { EventDbService } from 'src/db/event.service';
import { AwsService } from 'src/helper/aws.service';

@Injectable()
export class EventService {
    constructor(
        private readonly eventService: EventDbService,
        private readonly awsService: AwsService,
    ) { }

    async createEvent(
        owner: string,
        name: string,
        slug: string,
        excerpt: string,
        content: string,
        thumbnail: Express.Multer.File,
        tickets: { name: string; price: number }[],
    ) {
        const [fileData, awsError] = await this.awsService.uploadFile(
            owner,
            thumbnail,
        );

        if (awsError) {
            throw new HttpException(awsError.message, awsError.statusCode);
        }

        const [event, dbError] = await this.eventService.create(
            owner,
            name,
            slug,
            excerpt,
            content,
            fileData.url,
            tickets,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return event;
    }

    async getAllSlugs() {
        const [slugs, dbError] = await this.eventService.getAllSlugs();

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return slugs;
    }

    async getAllEvents() {
        const [events, dbError] = await this.eventService.getAll();

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return events;
    }

    async getEventsByOwner(owner: string) {
        const [events, dbError] = await this.eventService.getEventsByOwner(owner);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return events;
    }

    async getEvent(slug: string) {
        const [event, dbError] = await this.eventService.getEvent(slug);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return event;
    }

    async updateEvent(
        owner: string,
        event: string,
        name: string,
        excerpt: string,
        content: string,
        thumbnail: string,
        newThumbnail: Express.Multer.File,
    ) {
        if (newThumbnail) {
            const [fileData, awsError] = await this.awsService.uploadFile(
                owner,
                newThumbnail,
            );

            if (awsError) {
                throw new HttpException(awsError.message, awsError.statusCode);
            }

            thumbnail = fileData.url;
        }

        const dbError = await this.eventService.update(
            owner,
            event,
            name,
            excerpt,
            content,
            thumbnail,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return;
    }

    async updateTickets(
        owner: string,
        event: string,
        tickets: { id?: string; name: string; price: number }[],
        deleteTickets: string[],
    ) {
        const dbError = await this.eventService.updateTicket(owner, event, tickets);
        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        const dbError2 = await this.eventService.deleteTicket(
            owner,
            event,
            deleteTickets,
        );
        if (dbError2) {
            throw new HttpException(dbError2.message, dbError2.statusCode);
        }

        return;
    }

    async deleteEvent(owner: string, event: string) {
        const dbError = await this.eventService.delete(owner, event);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return;
    }
}
