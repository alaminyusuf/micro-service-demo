import { DataTypes, Model } from 'sequelize';

import sequelize from './connection';

export class User extends Model {}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    passwordHash: {
      allowNull: false,
      type: DataTypes.CHAR(64),
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    modelName: 'users',
    sequelize,
  }
);

export class UserSessions extends Model {}

UserSessions.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      references: {
        key: 'id',
        model: 'users',
      },
    },
    expiresAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    modelName: 'userSessions',
    paranoid: false,
    updatedAt: false,
  }
);
