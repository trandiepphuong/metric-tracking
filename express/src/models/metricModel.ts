import mongoose, { Schema, type Document } from 'mongoose';
import { TypeEnum } from '../enums/type';

export interface IMetric extends Document {
    userId: string;
    type: string;
    value: number;
    unit: string;
    date: Date;
}

const MetricSchema: Schema = new Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: TypeEnum, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: Date, required: true },
});

export default mongoose.model<IMetric>('Metric', MetricSchema);
