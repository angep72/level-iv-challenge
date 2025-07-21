import { Request, Response, NextFunction } from 'express';
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateRegister: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
export declare const validateLogin: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
export declare const validateEvent: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
export declare const validateBooking: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
export declare const validateMongoId: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
//# sourceMappingURL=validation.d.ts.map