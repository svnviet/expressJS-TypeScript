import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm"

@Entity("room_voice_logs")
export class RoomVoiceLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_voice_id: number

    @Column()
    user_id: number

    @Column()
    mic: number

    @Column()
    start_time: Date

    @Column()
    end_time: Date

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}