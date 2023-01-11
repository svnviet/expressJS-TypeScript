import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("room_users")
export class RoomUser extends Model {
    @Column()
    room_id: number

    @Column()
    user_id: number

    @Column()
    status: number

    @Column()
    start_time: Date

    @Column()
    end_time: Date
}
