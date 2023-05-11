import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards/local.guard';

@ApiTags('Events Module')
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @UseGuards(LocalAuthGuard)
    @Post('create')
    @ApiCookieAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Create new event',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                slug: { type: 'string' },
                excerpt: { type: 'string' },
                content: { type: 'string' },
                tickets: { type: 'string' },
                thumbnail: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('thumbnail'))
    async createEvent(
        @Request() req,
        @Body()
        data: {
            name: string;
            slug: string;
            excerpt: string;
            content: string;
            tickets: string;
        },
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: 'image/*' })],
            }),
        )
        thumbnail: Express.Multer.File,
    ) {
        const { id: owner } = req.user;
        return await this.eventService.createEvent(
            owner,
            data.name,
            data.slug,
            data.excerpt,
            data.content,
            thumbnail,
            JSON.parse(data.tickets),
        );
    }

    @Get('get-all-slugs')
    async getAllSlugs() {
        return await this.eventService.getAllSlugs();
    }

    @Get('get-all')
    async getAllEvents() {
        return await this.eventService.getAllEvents();
    }

    @Get('get-by-owner')
    async getEventsByOwner(@Request() req) {
        const { id: owner } = req.user;

        return await this.eventService.getEventsByOwner(owner);
    }

    @Get('get/:slug')
    async getEvent(@Param('slug') slug: string) {
        return await this.eventService.getEvent(slug);
    }

    @UseGuards(LocalAuthGuard)
    @Put('update/:id')
    @UseInterceptors(FileInterceptor('thumbnail'))
    @ApiCookieAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Create new event',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                slug: { type: 'string' },
                excerpt: { type: 'string' },
                content: { type: 'string' },
                tickets: { type: 'string' },
                thumbnail: { type: 'string' },
                newThumbnail: { type: 'string', format: 'binary' },
            },
        },
    })
    async updateEvent(
        @Request() req,
        @Param('id') id: string,
        @Body()
        data: {
            name: string;
            excerpt: string;
            content: string;
            thumbnail: string;
        },
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: 'image/*' })],
            }),
        )
        newThumbnail: Express.Multer.File,
    ) {
        const { id: owner } = req.user;
        return await this.eventService.updateEvent(
            owner,
            id,
            data.name,
            data.excerpt,
            data.content,
            data.thumbnail,
            newThumbnail,
        );
    }

    @UseGuards(LocalAuthGuard)
    @Put('update-tickets/:id')
    @ApiCookieAuth()
    @ApiBody({
        description: 'Update tickets',
        schema: {
            type: 'object',
            properties: {
                tickets: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            price: { type: 'number' },
                        },
                    },
                },
                deleteTickets: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            },
        },
    })
    async updateTickets(
        @Request() req,
        @Param('id') id: string,
        @Body()
        data: {
            tickets: { id?: string; name: string; price: number }[];
            deleteTickets: string[];
        },
    ) {
        const { id: owner } = req.user;
        await this.eventService.updateTickets(
            owner,
            id,
            data.tickets,
            data.deleteTickets,
        );
        return;
    }

    @UseGuards(LocalAuthGuard)
    @Delete('delete/:id')
    @ApiCookieAuth()
    async deleteEvent(@Request() req, @Param('id') id: string) {
        const { id: owner } = req.user;
        return await this.eventService.deleteEvent(owner, id);
    }
}
