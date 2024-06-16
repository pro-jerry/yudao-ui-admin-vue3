<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="区号" prop="regionId">
        <el-input v-model="formData.regionId" placeholder="请输入区号" />
      </el-form-item>
      <el-form-item label="省市区的名字" prop="regionName">
        <el-input v-model="formData.regionName" placeholder="请输入省市区的名字" />
      </el-form-item>
      <el-form-item label="上级的区号" prop="regionParentId">
        <el-input v-model="formData.regionParentId" placeholder="请输入上级的区号" />
      </el-form-item>
      <el-form-item label="0中国 1省 2市 3区" prop="regionLevel">
        <el-input v-model="formData.regionLevel" placeholder="请输入0中国 1省 2市 3区" />
      </el-form-item>
      <el-form-item label="创建者ID" prop="creatorId">
        <el-input v-model="formData.creatorId" placeholder="请输入创建者ID" />
      </el-form-item>
      <el-form-item label="更新者ID" prop="updaterId">
        <el-input v-model="formData.updaterId" placeholder="请输入更新者ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {CityApi, CityVO} from '@/api/system/city'

/** 地区 表单 */
defineOptions({ name: 'CityForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  regionId: undefined,
  regionName: undefined,
  regionParentId: undefined,
  regionLevel: undefined,
  creatorId: undefined,
  updaterId: undefined,
})
const formRules = reactive({
  regionId: [{ required: true, message: '区号不能为空', trigger: 'blur' }],
  regionName: [{ required: true, message: '省市区的名字不能为空', trigger: 'blur' }],
  regionParentId: [{ required: true, message: '上级的区号不能为空', trigger: 'blur' }],
  regionLevel: [{ required: true, message: '0中国 1省 2市 3区不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CityApi.getCity(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CityVO
    if (formType.value === 'create') {
      await CityApi.createCity(data)
      message.success(t('common.createSuccess'))
    } else {
      await CityApi.updateCity(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    regionId: undefined,
    regionName: undefined,
    regionParentId: undefined,
    regionLevel: undefined,
    creatorId: undefined,
    updaterId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
