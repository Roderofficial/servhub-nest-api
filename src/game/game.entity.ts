import {
  Table,
  Column,
  Model,
  Unique,
  PrimaryKey,
  Default,
  AllowNull,
  NotNull,
  HasMany,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { Server } from '../server/server.entity';

@Table
export class Game extends Model<Game> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  port: number;

  @AllowNull(false)
  @Column({ defaultValue: 1, type: DataType.FLOAT })
  premiumPrice: number;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;

  @HasMany(() => Server)
  servers: Server[];
}
