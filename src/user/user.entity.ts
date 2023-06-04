import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  DataType,
} from 'sequelize-typescript';
import { Server } from 'src/server/server.entity';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  username: string;

  @Unique
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column({ defaultValue: false })
  verificatied: boolean;

  @AllowNull(false)
  @Column({ defaultValue: 0, type: DataType.FLOAT })
  balance: number;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;

  @HasMany(() => Server)
  servers: Server[];
}
