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
} from 'sequelize-typescript';
import { Game } from '../game/game.entity';
import { User } from 'src/user/user.entity';

@Table
export class Server extends Model<Server> {
  @PrimaryKey
  @Unique
  @Column
  id: number;

  @AllowNull(false)
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

  @AllowNull(false)
  @Column
  online: boolean;

  @AllowNull(true)
  @Column(DataType.JSON)
  extras: JSON;

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
}
