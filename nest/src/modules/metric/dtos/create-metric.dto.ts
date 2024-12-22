import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
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
  @IsOptional()
  date: string;
}
