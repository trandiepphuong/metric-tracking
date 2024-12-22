import { TypeEnum } from '../../enums/type';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MetricEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({ type: 'enum', enum: TypeEnum })
    type: TypeEnum;

    @Column()
    value: number;

    @Column()
    unit: string;

    @Column()
    date: Date;
}
