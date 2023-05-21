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
import { Server } from 'src/server/server.entity';

@Table
export class ServerStatus extends Model<ServerStatus> {
  @PrimaryKey
  @Unique
  @Column
  id: number;

  @AllowNull(false)
  @Column
  online: boolean;

  @AllowNull(false)
  @Column
  players: number;

  @AllowNull(false)
  @Column
  maxPlayers: number;

  @AllowNull(true)
  @Column(DataType.JSON)
  extras: JSON;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;

  @ForeignKey(() => Server)
  @Column
  serverId: number;

  @BelongsTo(() => Server)
  server: Server;
}
