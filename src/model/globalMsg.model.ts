import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@/config/mysql';
import { initTable } from '@/init/initDb';
import { IGlobalMsg } from '@/interface';

interface GlobalMsgModel
  extends Model<
      InferAttributes<GlobalMsgModel>,
      InferCreationAttributes<GlobalMsgModel>
    >,
    IGlobalMsg {}

const model = sequelize.define<GlobalMsgModel>(
  'global_msg',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING(500),
    },
    remark: {
      type: DataTypes.STRING(500),
    },
  },
  {
    indexes: [
      {
        name: 'user_id',
        fields: ['user_id'],
      },
    ],
    paranoid: true,
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

initTable({ model, sequelize });

export default model;