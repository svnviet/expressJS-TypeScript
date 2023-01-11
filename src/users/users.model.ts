import { MaxLength } from "class-validator";
import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("users")
export class User extends Model {
    @Column()
    @MaxLength(255)
    uid: string

    @Column()
    @MaxLength(255)
    login_id: string

    @Column()
    company_id: number

    @Column()
    role: number

    @Column()
    status: number

    @Column()
    @MaxLength(100)
    email: string

    @Column()
    @MaxLength(10)
    code: string

    @Column()
    email_verified_at: Date

    @Column()
    @MaxLength(255)
    email_verify_token: string

    @Column()
    @MaxLength(255)
    password: string

    @Column()
    @MaxLength(100)
    remember_token: string

    @Column()
    @MaxLength(255)
    onamae: string

    @Column()
    @MaxLength(255)
    nick_name: string

    @Column()
    login_status: number

    @Column()
    @MaxLength(255)
    comment: string

    @Column()
    is_mic: number

    @Column()
    is_speaker: number

    @Column()
    @MaxLength(255)
    avatar: string

    @Column()
    @MaxLength(255)
    profile: string

    @Column()
    @MaxLength(255)
    custom_status: string

    setValues(user: User) {
        user.uid == undefined ? this.uid = "" : this.uid = user.uid.toString();

        user.login_id == undefined ? this.login_id = "" : this.login_id = user.login_id;

        user.email == undefined ? this.email = "" : this.email = user.email;

        user.code == undefined ? this.code = "" : this.code = user.code;

        user.email_verify_token == undefined ? this.email_verify_token = "" : this.email_verify_token = user.email_verify_token;

        user.password == undefined ? this.password = "" : this.password = user.password;

        user.remember_token == undefined ? this.remember_token = "" : this.remember_token = user.remember_token;

        user.onamae == undefined ? this.onamae = "" : this.onamae = user.onamae;

        user.nick_name == undefined ? this.nick_name = "" : this.nick_name = user.nick_name;

        user.comment == undefined ? this.comment = "" : this.comment = user.comment;

        user.avatar == undefined ? this.avatar = "" : this.avatar = user.avatar

        user.profile == undefined ? this.profile = "" : this.profile = user.profile
    }
}
