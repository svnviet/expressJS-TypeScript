import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("room_voices")
export class RoomVoice extends Model {
    @Column()
    room_id: number

    @Column()
    start_time: Date

    @Column()
    end_time: Date

    @Column()
    status: number

    @Column()
    user_count1: number

    @Column()
    user_count2: number
}