import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Measure {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column('timestamp')
    measure_datetime!: Date;

    @Column('varchar')
    measure_type!: string; 

    @Column('boolean', { default: false })
    isConfirmed!: boolean;

    @Column('int', { nullable: true })
    confirmedValue?: number;

    @Column('varchar')
    imageUrl!: string;
}
