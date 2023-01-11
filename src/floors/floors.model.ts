import { MaxLength } from "class-validator";
import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("floors")
export class Floor extends Model {
    @Column()
    company_id: number

    @Column()
    status: number

    @Column()
    @MaxLength(255)
    name: string

    @Column()
    view_no: number

    @Column()
    created_user: string

    @Column()
    updated_user: string
}
