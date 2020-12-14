import { format, transports } from 'winston';
import expressWinston from "express-winston";
import { ErrorRequestHandler, Handler } from 'express';

export class LoggingFactory {
	static getWinstonLogger: Handler = expressWinston.logger({
		format: format.combine(
			format.colorize(),
			format.timestamp(),
			format.json()
		),
		transports: [
			new transports.Console(),
			new transports.File({ filename: '../logs/error.log', level: 'error' }),
			new transports.File({ filename: '../logs/info.log', level: 'info' }),
		]
	});

	static getWinstonErrorLogger: ErrorRequestHandler = expressWinston.errorLogger({
		format: format.combine(
			format.colorize(),
			format.timestamp(),
			format.json()
		),
		transports: [
			new transports.Console(),
			new transports.File({ filename: '../logs/error.log', level: 'error' }),
		],
	});
}