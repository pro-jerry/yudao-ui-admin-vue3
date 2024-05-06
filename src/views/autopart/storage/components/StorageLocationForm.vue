<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="库位名字" prop="name">
        <el-input maxlength="100" v-model="formData.name" placeholder="请输入库位名字" />
      </el-form-item>
      <el-form-item label="库位容量(m³)" prop="capacity">
        <el-input type="number" max="1000000" min="1" v-model="formData.capacity" placeholder="请输入库位容量(m³)" />
      </el-form-item>
      <el-form-item label="库位状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.AUTOPART_STORAGE_LOCATION_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input type="number" max="10000" min="1" v-model="formData.sort" placeholder="请输入排序序号" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" maxlength="1000" v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StorageApi } from '@/api/autopart/storage'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  name: undefined,
  storageId: undefined,
  num: undefined,
  capacity: undefined,
  status: undefined,
  sort: undefined,
  remark: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '库位名字不能为空', trigger: 'blur' }],
  storageId: [{ required: true, message: '仓库ID不能为空', trigger: 'blur' }],
  num: [{ required: true, message: '库位编号不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '库位状态 0=关闭 1=开启不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number,storageId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  let storageId1 = storageId;
  formData.value.storageId = storageId1
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StorageApi.getStorageLocation(id)
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
    const data = formData.value
    if (formType.value === 'create') {
      await StorageApi.createStorageLocation(data)
      message.success(t('common.createSuccess'))
    } else {
      await StorageApi.updateStorageLocation(data)
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
    name: undefined,
    storageId: undefined,
    num: undefined,
    capacity: undefined,
    status: undefined,
    sort: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
