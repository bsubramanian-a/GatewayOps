export declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => any;
//# sourceMappingURL=errorHandler.d.ts.map