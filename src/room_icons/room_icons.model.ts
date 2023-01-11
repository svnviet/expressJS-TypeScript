import { MaxLength } from "class-validator";
import { Entity, Column } from "typeorm"
import Model from '../model.entity';

@Entity("room_icons")
export class RoomIcon extends Model {
    @Column()
    company_id: number

    @Column()
    status: number

    @Column()
    @MaxLength(255)
    icon_images: string
}
