import type { TypeEnum } from '../enums/type';
import Metric, { type IMetric } from '../models/metricModel';
import { convertUnit } from '../utils/unitConversion';

export const createMetric = async (data: IMetric): Promise<IMetric> => {
    const metric = new Metric(data);
    return metric.save();
};

export const getMetrics = async (type: TypeEnum, userId: string): Promise<IMetric[]> => {
    return Metric.find({ type, userId });
};

export const getChartData = async (type: TypeEnum, userId: string, period: number, unit?: string): Promise<IMetric[]> => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - period);

    const metrics = await Metric.aggregate([
        {
            $match: { // query by type, userId, date
                type,
                userId,
                date: { $gte: startDate }, // greater or equal
            },
        },
        {
            $group: { // group by
                _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    userId: "$userId",
                    type: "$type",
                },
                latestMetric: { $last: "$$ROOT" },
            },
        },
        {
            $replaceRoot: { newRoot: "$latestMetric" },
        },
        {
            $sort: { date: 1 },
        },
    ]);

    if (unit) {
        console.log(metrics);
        return metrics.map((metric) => {
            metric.value = convertUnit(metric.type, metric.unit, unit, metric.value);
            metric.unit = unit;
            metric.type = type;
            metric.userId = userId;

            return metric
        });
    }

    return metrics;
};
