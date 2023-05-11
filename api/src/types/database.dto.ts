import { Event, Order, Ticket, User } from '@prisma/client';

export type UserDto = User | null;

export type EventsDto = Event[] | null;
export type EventDetailDto = (Event & { tickets: Ticket[] }) | null;

export type TicketDto = Ticket | null;
export type TicketsDto = Ticket[] | null;

export type OrdersDto = (Order & { event: Event })[] | null;
export type OrderDetailDto = (Order & { event: Event; owner: User }) | null;
