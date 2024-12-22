import { z } from "zod";
import { TypeEnum } from "../../enums/type";

const zString = z.coerce.string().trim();
const zNumber = z.coerce.number();

export const CreateMetricSchema = z.object({
    userId: zString,
    type: z.enum([TypeEnum.DISTANCE, TypeEnum.TEMPERATURE]),
    value: zNumber,
    unit: zString,
    date: zString.datetime(),
});
