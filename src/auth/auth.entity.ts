import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  AllowNull,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
  BelongsToAssociation,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table
export class AuthToken extends Model<AuthToken> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  token: string;

  @AllowNull(false)
  @Column
  expiresAt: Date;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @AllowNull(false)
  @Column
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
