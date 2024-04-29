import request from '@/config/axios'

// 汽配仓库 VO
export interface StorageVO {
  name: string // 仓库名字
  num: string // 仓库编号
  capacity: number // 库存容量(立方米)
  address: string // 仓库地址
  sort: number // 排序序号
  status: number // 仓库状态 0=关闭 1=开启
  lock: number // 是否锁定 0=未锁定 1=已锁定
  remark: string // 备注
  userId: number // 仓库主管ID
}

// 汽配仓库 API
export const StorageApi = {
  // 查询汽配仓库分页
  getStoragePage: async (params: any) => {
    return await request.get({ url: `/autopart/storage/page`, params })
  },

  // 查询汽配仓库详情
  getStorage: async (id: number) => {
    return await request.get({ url: `/autopart/storage/get?id=` + id })
  },

  // 新增汽配仓库
  createStorage: async (data: StorageVO) => {
    return await request.post({ url: `/autopart/storage/create`, data })
  },

  // 修改汽配仓库
  updateStorage: async (data: StorageVO) => {
    return await request.put({ url: `/autopart/storage/update`, data })
  },

  // 删除汽配仓库
  deleteStorage: async (id: number) => {
    return await request.delete({ url: `/autopart/storage/delete?id=` + id })
  },

  // 导出汽配仓库 Excel
  exportStorage: async (params) => {
    return await request.download({ url: `/autopart/storage/export-excel`, params })
  },
}