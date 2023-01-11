import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("room_voice_access_logs")
export class RoomVoiceAccessLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_voice_id: number

    @Column()
    user_id: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}