import { MaxLength } from "class-validator";
import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("companies")
export class Company extends Model {
    @Column()
    @MaxLength(20)
    company_code: string

    @Column()
    @MaxLength(20)
    company_name: string

    @Column()
    status: number

    @Column()
    is_trial: number

    @Column()
    trial_register_at: Date

    @Column()
    trial_expired_at: Date

    @Column()
    plan: number

    @Column()
    @MaxLength(255)
    site_url: string

    @Column()
    @MaxLength(8)
    post: string

    @Column()
    @MaxLength(255)
    address: string

    @Column()
    @MaxLength(255)
    telno: string

    @Column()
    @MaxLength(255)
    memo: string

    @Column()
    subscription_registered_at: Date

    @Column()
    subscription_start_at: Date

    @Column()
    settlement_plan: number

    @Column()
    subscription: number

    @Column()
    subscription_cancelled_at: Date

    @Column()
    @MaxLength(255)
    credit_no: string

    @Column()
    @MaxLength(255)
    card_brand: string

    @Column()
    @MaxLength(255)
    credit_token: string
}
