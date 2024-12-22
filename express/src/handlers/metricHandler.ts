import type { NextFunction, Request, Response } from 'express';
import { getMetrics, createMetric, getChartData } from '../services/metricService';
import { makeError } from '../utils/makeError';
import type { TypeEnum } from '../enums/type';
import { CreateMetricSchema } from './validator/createMetric';
import { isNil } from "lodash";

export const addMetric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { success, data, error } = CreateMetricSchema.safeParse(req.body);

    if (!success) {
        const resErr = makeError(
            400,
            "Bad Request",
            "Invalid request data",
            error.issues,
        );
        return next(resErr);
    }

    if (isNil(data)) {
        const resErr = makeError(400, "Bad Request", "Nil request data");
        return next(resErr);
    }
    
    try {
        const metric = await createMetric(req.body);
        res.status(201).json(metric);
    } catch (error) {
        if (error instanceof Error) {
            next(makeError(500, "Internal Error", "Something wrong", error.message));
        }
    }
};

export const fetchMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { type, userId } = req.query;
        const metrics = await getMetrics(type as TypeEnum, String(userId));
        res.status(200).json(metrics);
    } catch (error) {
        if (error instanceof Error) {
            next(makeError(500, "Internal Error", "Something wrong", error.message));
        }
    }
};

export const fetchChartData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { type, userId, period, unit } = req.query;
        if (!type || !userId || !period) {
            const resErr = makeError(400, "Bad Request", "Missing filter data");
            return next(resErr);
        }
        const data = await getChartData(type as TypeEnum, String(userId), Number(period), String(unit));
        res.status(200).json(data);
    } catch (error) {
        if (error instanceof Error) {
            next(makeError(500, "Internal Error", "Something wrong", error.message));
        }
    }
};
