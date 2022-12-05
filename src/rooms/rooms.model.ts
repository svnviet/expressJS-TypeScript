import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("rooms")
export class Room extends Model {
    @Column()
    floor_id: number

    @Column()
    status: number

    @Column()
    name: string

    @Column()
    room_icon_id: number

    @Column()
    view_no: number

    @Column()
    created_user: number

    @Column()
    updated_user: number
}
