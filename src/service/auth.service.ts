import { deleteUseLessObjectKey, filterObj } from 'billd-utils';
import { Op } from 'sequelize';

import { IAuth, IList } from '@/interface';
import authModel from '@/model/auth.model';
import {
  handleKeyWord,
  handleOrder,
  handlePage,
  handlePaging,
  handleRangTime,
} from '@/utils';

class AuthService {
  /** 权限是否存在 */
  async isExist(ids: number[]) {
    const res = await authModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return res === ids.length;
  }

  /** 获取权限列表(分页) */
  async getList({
    id,
    orderBy,
    orderName,
    nowPage,
    pageSize,
    keyWord,
    rangTimeType,
    rangTimeStart,
    rangTimeEnd,
  }: IList<IAuth>) {
    const { offset, limit } = handlePage({ nowPage, pageSize });
    const allWhere: any = deleteUseLessObjectKey({
      id,
    });
    const keyWordWhere = handleKeyWord({
      keyWord,
      arr: ['auth_name', 'auth_value'],
    });
    if (keyWordWhere) {
      allWhere[Op.or] = keyWordWhere;
    }
    const rangTimeWhere = handleRangTime({
      rangTimeType,
      rangTimeStart,
      rangTimeEnd,
    });
    if (rangTimeWhere) {
      allWhere[rangTimeType!] = rangTimeWhere;
    }
    const orderRes = handleOrder({ orderName, orderBy });
    const result = await authModel.findAndCountAll({
      order: [...orderRes],
      limit,
      offset,
      distinct: true,
      where: {
        ...allWhere,
      },
    });
    return handlePaging(result, nowPage, pageSize);
  }

  /** 获取权限列表(不分页) */
  async getAllList() {
    const result = await authModel.findAndCountAll();
    return result;
  }

  /** 获取所有p_id不为null的权限 */
  async getPidNotNullAuth() {
    const result = await authModel.findAndCountAll({
      // @ts-ignore
      where: {
        p_id: {
          [Op.not]: null, // IS NOT NULL
          // [Op.not]: true, // IS NOT TRUE
        },
      },
    });
    return result;
  }

  /** 查找权限 */
  async find(id: number) {
    const result = await authModel.findOne({
      where: {
        id,
      },
    });
    return result;
  }

  /** 查找id为[a,b,c....]的权限 */
  async findAllByInId(ids: number[]) {
    const result = await authModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return result;
  }

  /** 根据p_id查找权限 */
  async findByPid(p_id: number) {
    const result = await authModel.findAll({
      where: {
        p_id,
      },
    });
    return result;
  }

  /** 修改权限 */
  async update(data: IAuth) {
    const { id } = data;
    const data2 = filterObj(data, ['id']);
    const result = await authModel.update(data2, { where: { id } });
    return result;
  }

  /** 修改权限 */
  async updateMany(ids: number[], p_id: number) {
    const result = await authModel.update(
      {
        p_id,
      },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );
    return result;
  }

  async findAllChildren(id: number) {
    const result = await authModel.findAll({
      where: {
        p_id: id,
      },
    });
    return result;
  }

  /** 创建权限 */
  async create(data: IAuth) {
    const result = await authModel.create(data);
    return result;
  }

  /** 删除权限 */
  async delete(ids: number[]) {
    const result = await authModel.destroy({
      where: {
        id: {
          [Op.in]: ids, // [Op.in]的话，ids是[]，就一个也不会删。如果是[Op.or]，ids是[]，就会删除所有。
        },
      },
    });
    return result;
  }
}

export default new AuthService();
