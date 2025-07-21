import { Request, Response } from 'express';
export declare const getAllEvents: (req: Request, res: Response) => Promise<void>;
export declare const getEventById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEvent: (req: Request, res: Response) => Promise<void>;
export declare const updateEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEventBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=eventController.d.ts.map