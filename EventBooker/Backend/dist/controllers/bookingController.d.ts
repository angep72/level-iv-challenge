import { Request, Response } from "express";
export declare const createBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserBookings: (req: Request, res: Response) => Promise<void>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBookingById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=bookingController.d.ts.map