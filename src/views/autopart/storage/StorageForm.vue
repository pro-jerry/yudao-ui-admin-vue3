<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="仓库名字" prop="name">
        <el-input v-model="formData.name" placeholder="请输入仓库名字" />
      </el-form-item>
<!--      <el-form-item label="仓库编号" prop="num">-->
<!--        <el-input v-model="formData.num" placeholder="请输入仓库编号" />-->
<!--      </el-form-item>-->
      <el-form-item label="库存容量(m³)" prop="capacity">
        <el-input type="number" max="10000" min="1" v-model="formData.capacity" placeholder="请输入库存容量" />
      </el-form-item>
      <el-form-item label="仓库地址" prop="address">
        <el-input maxlength="500" v-model="formData.address" placeholder="请输入仓库地址" />
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input type="number" max="10000" min="1" v-model="formData.sort" placeholder="请输入排序序号" />
      </el-form-item>
      <el-form-item label="仓库状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.AUTOPART_STORAGE_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否锁定" prop="locked">
        <el-radio-group v-model="formData.locked">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.AUTOPART_STORAGE_LOCKED)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="仓库主管" prop="userId">
        <el-select
          v-model="formData.userId"
          filterable
          placeholder="请选择仓库主管"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { StorageApi, StorageVO } from '@/api/autopart/storage'
import {getSimpleUserList} from "@/api/system/user";
import * as UserApi from '@/api/system/user'

/** 汽配仓库 表单 */
defineOptions({ name: 'StorageForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  name: undefined,
  // num: undefined,
  capacity: undefined,
  address: undefined,
  sort: undefined,
  status: undefined,
  locked: undefined,
  remark: undefined,
  userId: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '仓库名字不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '仓库状态 0=关闭 1=开启不能为空', trigger: 'blur' }],
  locked: [{ required: true, message: '是否锁定 0=未锁定 1=已锁定不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '仓库主管不能为空', trigger: 'blur' }],
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
      formData.value = await StorageApi.getStorage(id)
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
    const data = formData.value as unknown as StorageVO
    if (formType.value === 'create') {
      await StorageApi.createStorage(data)
      message.success(t('common.createSuccess'))
    } else {
      await StorageApi.updateStorage(data)
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
    // num: undefined,
    capacity: undefined,
    address: undefined,
    sort: undefined,
    status: undefined,
    locked: undefined,
    remark: undefined,
    userId: undefined,
  }
  formRef.value?.resetFields()
}

onMounted(async () => {
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
})
</script>
