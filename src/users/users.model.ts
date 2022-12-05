import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("users")
export class User extends Model {
    @Column()
    uid: string

    @Column()
    login_id: string

    @Column()
    company_id: number

    @Column()
    role: number

    @Column()
    status: number

    @Column()
    email: string

    @Column()
    code: string

    @Column()
    email_verified_at: Date

    @Column()
    email_verify_token: string

    @Column()
    password: string

    @Column()
    remember_token: string

    @Column()
    onamae: string

    @Column()
    nick_name: string

    @Column()
    login_status: number

    @Column()
    comment: string

    @Column()
    is_mic: number

    @Column()
    is_speaker: number

    @Column()
    avatar: string

    @Column()
    profile: string
}
