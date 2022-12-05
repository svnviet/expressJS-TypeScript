import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("companies")
export class Company extends Model {
    @Column()
    company_code: string

    @Column()
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
    site_url: string

    @Column()
    post: string

    @Column()
    address: string

    @Column()
    telno: string

    @Column()
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
    credit_no: string

    @Column()
    card_brand: string

    @Column()
    credit_token: string
}
