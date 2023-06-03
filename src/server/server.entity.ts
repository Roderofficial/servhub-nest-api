import {
  Table,
  Column,
  Model,
  Unique,
  PrimaryKey,
  Default,
  AllowNull,
  NotNull,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
  BelongsToAssociation,
  HasMany,
  BelongsToMany,
  AutoIncrement,
} from 'sequelize-typescript';
import { Game } from '../game/game.entity';
import { User } from 'src/user/user.entity';
import { ServerStatus } from 'src/server-status/server-status.entity';

@Table
export class Server extends Model<Server> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(true)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  ip: string;

  @AllowNull(true)
  @Column
  port: number;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;

  @AllowNull(true)
  @Column
  online: boolean;

  @AllowNull(true)
  @Column(DataType.JSON)
  extras: JSON;

  @AllowNull(true)
  @Column({ defaultValue: null })
  country_code: string;

  @ForeignKey(() => Game)
  @Column
  gameId: number;

  @BelongsTo(() => Game)
  game: Game;

  @ForeignKey(() => User)
  @Column
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;

  @HasMany(() => ServerStatus)
  serverStatuses: ServerStatus[];
}
