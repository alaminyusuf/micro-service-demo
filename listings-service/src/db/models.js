import { DataTypes, Model } from 'sequelize';

import sequelize from './connection';

export class Listings extends Model {}
Listings.init(
  {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {
    modelName: 'Listings',
    sequelize,
  }
);
