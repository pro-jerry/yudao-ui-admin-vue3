import request from '@/config/axios'

// 地区 VO
export interface CityVO {
  regionId: string // 区号
  regionName: string // 省市区的名字
  regionParentId: string // 上级的区号
  regionLevel: number // 0中国 1省 2市 3区
}

// 地区 API
export const CityApi = {
  // 查询地区列表
  getCityList: async (params) => {
    return await request.get({ url: `/system/city/list`, params })
  },

  // 查询地区详情
  getCity: async (id: number) => {
    return await request.get({ url: `/system/city/get?id=` + id })
  },

  // 新增地区
  createCity: async (data: CityVO) => {
    return await request.post({ url: `/system/city/create`, data })
  },

  // 修改地区
  updateCity: async (data: CityVO) => {
    return await request.put({ url: `/system/city/update`, data })
  },

  // 删除地区
  deleteCity: async (id: number) => {
    return await request.delete({ url: `/system/city/delete?id=` + id })
  },

  // 导出地区 Excel
  exportCity: async (params) => {
    return await request.download({ url: `/system/city/export-excel`, params })
  },
}