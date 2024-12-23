import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString
} from 'class-validator';
import { TypeEnum } from '../../../enums/type';

export class CreateMetricDto {
  @IsString()
  userId: string;

  @IsEnum(TypeEnum)
  type: TypeEnum;

  @IsNumber()
  value: number;

  @IsString()
  unit: string;

  @IsDateString()
  // @IsOptional()
  date: Date;
}
