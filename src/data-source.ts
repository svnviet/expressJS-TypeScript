import "reflect-metadata"
import * as dotenv from "dotenv";
import { DataSource } from "typeorm"
import { User } from "./users/users.model"
import { Company } from "./companies/companies.model"
import { Floor } from "./floors/floors.model"
import { Room } from "./rooms/rooms.model"
import { RoomUser } from "./room_users/room_users.model"
import { RoomIcon } from "./room_icons/room_icons.model"

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MY_SQL_DB_HOST,
    port: parseInt(process.env.MY_SQL_DB_PORT),
    username: process.env.MY_SQL_DB_USER,
    password: process.env.MY_SQL_DB_PASSWORD,
    database: process.env.MY_SQL_DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Company, Floor, Room, RoomUser, RoomIcon],
    migrations: [],
    subscribers: [],
})
