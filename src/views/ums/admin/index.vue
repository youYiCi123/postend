<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="default" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable></el-input>
          </el-form-item>
          <!-- todo -->
          <el-form-item label="部门分类：">
            <el-select v-model="listQuery.depId" placeholder="请选择部门" clearable>
              <el-option v-for="item in allDepList" :key="item.id" :label="item.depName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-button size="small" class="btn-add" @click="handleAdd()" style="float:right; margin-bottom: 20px">添加
      </el-button>
      <!-- todo -->
      <el-upload class="upload" action="#" :show-file-list="false" :on-change="handleExcel" accept="'.xlsx','.xls'"
        :auto-upload="false" :headers="headers"
        style="float:right; margin-right: 20px ;margin-left: 20px;margin-bottom: 20px">
        <el-button size="small" type="primary">Excel导入</el-button>
      </el-upload>
      <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" stripe v-loading="listLoading"
        @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="姓名" width="130" align="center">
          <template #default="scope">{{ scope.row.nickName }}</template>
        </el-table-column>
        <el-table-column label="帐号" width="130" align="center">
          <template #default="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="部门" width="130" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.depName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="职责" width="220" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.duty==='部门经理'?'warning':'success'">{{ scope.row.duty }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="130" align="center">
          <template #default="scope">{{ scope.row.phoneNumber }}</template>
        </el-table-column>
        <el-table-column label="邮箱" width="170" align="center">
          <template #default="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="住址" width="160" align="center">
          <template #default="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">
            <span v-html="timeFormat(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="120" align="center">
          <template #default="scope">
            <el-switch @change="handleStatusChange(scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleSelectRole(scope.row)">分配角色
            </el-button>
            <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :layout="paginationData.layout" :current-page.sync="paginationData.currentPage"
        :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑用户' : '添加用户'" v-model="dialogVisible" width="40%">
      <el-form :model="admin" ref="adminForm" label-width="150px" size="small" :rules="addUserRules">
        <el-form-item label="姓名：" prop="nickName">
          <el-input v-model="admin.nickName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="admin.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNumber">
          <el-input v-model="admin.phoneNumber" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="admin.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-input v-model="admin.address" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          <el-select v-model="admin.depId" placeholder="请选择" size="small" style="width:250px">
            <el-option v-for="item in allDepList" :key="item.id" :label="item.depName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职责：">
          <el-input v-model="admin.duty" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="帐号：">
          <el-input v-model="admin.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="admin.password" type="password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="admin.note" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="admin.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm(adminForm)" size="small">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="分配角色" v-model="allocDialogVisible" width="30%">
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option v-for="item in allRoleList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <template #footer>
        <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive,watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import { RoleMode } from "@/mode/UserInfo/RoleMode";
import { UserTableMode } from "@/mode/UserInfo/UserInfoMode";
import { DepIdAndName } from "@/mode/DepInfoMode";
import { fetchList, createAdmin, updateAdmin, updateStatus, deleteAdmin, getRoleByAdmin, allocRole, handleBatchDelete } from '@/api/login';
import { fetchAllRoleList } from '@/api/role';
import { exportUserExcel } from "@/api/exportExcel";
import { getDepIdToName } from "@/api/dep"
import dayjs from "dayjs";
import { validateTelephone, validateEmail } from '@/utils/validate';

const list = ref<UserTableMode[]>([])
const total = ref(0);
let listQuery = reactive({
  keyword: '',
  depId: '',
});
const listLoading = ref(false);
const dialogVisible = ref(false);
const admin = reactive({
  id: -1,
  username: '',
  sex: 1,
  password: '',
  nickName: '',
  email: '',
  address: '',
  depId: '',
  duty: '',
  phoneNumber: '',
  note: '',
  status: 1
})
const isEdit = ref(false);
const allocDialogVisible = ref(false);
const headers = { "Content-Type": "multipart/form-data;charset=UTF-8" };
// 用户对应的角色
const allocRoleIds = ref<number[]>([])
//显示部门id和名称 用于select选择器 
const allDepList = ref<DepIdAndName[]>([])
//用于给用户选择分配角色
const allRoleList = ref<RoleMode[]>([])
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<UserTableMode[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])
//用于分配角色时候，暂时存放用户Id
const allocAdminId = ref(-1)
/** 验证规则 */
const addUserRules: FormRules = {
  nickName: [{ required: true, trigger: 'change', message: '姓名不能为空' }],
  phoneNumber: [{ required: true, trigger: 'blur', validator: validateTelephone }],
  email: [{ required: true, trigger: 'blur', validator: validateEmail }],
}

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
//导入表格
function handleExcel(file: any) {
  let formData = new FormData(); //声明一个FormDate对象
  formData.append("file", file.raw);    //把文件信息放入对象中
  //调用后台导入的接口
  exportUserExcel(formData).then(res => {
    if (res.code === 200) { //得自定义res属性 在AxiosResponse中定义
      ElMessage.success("导入成功");
      getList();   // 导入表格之后可以获取导入的数据渲染到页面，此处的方法是获取导入的数据
    } else {
      ElMessage.error(res.message)
    }
  }).catch(err => {
    ElMessage({
      type: 'error',
      message: '导入失败'
    })
  })
}
function handleResetSearch() {
  listQuery.depId = '';
  listQuery.keyword = ''
}
function handleSearchList() {
  paginationData.currentPage = 1
  getList();
}
function handleAdd() {
  dialogVisible.value = true;
  isEdit.value = false;
  admin.id = -1
  admin.username = ''
  admin.sex = 1
  admin.password = ''
  admin.nickName = ''
  admin.email = ''
  admin.address = ''
  admin.depId = ''
  admin.duty = ''
  admin.phoneNumber = ''
  admin.note = ''
  admin.status = 1
}
function handleStatusChange(row: UserTableMode) {
  ElMessageBox.confirm('是否要修改该状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    updateStatus(row.id, { status: row.status }).then(response => {
      ElMessage({
        type: 'success',
        message: '修改成功!'
      });
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消修改'
    });
    getList();
  });
}

function timeFormat(time: string) {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function getDepSelector() {
  getDepIdToName().then(response => {
    allDepList.value = response.data
  })
}
function handleDelete(row: UserTableMode) {
  ElMessageBox.confirm('是否要删除该用户?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteAdmin(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  });
}
function handleUpdate(row: UserTableMode) {
  dialogVisible.value = true;
  isEdit.value = true;
  admin.id = row.id
  admin.username = row.username
  admin.sex = row.sex
  admin.password = row.password
  admin.nickName = row.nickName
  admin.email = row.email
  admin.address = row.address
  admin.depId = row.depId
  admin.duty = row.duty
  admin.phoneNumber = row.phoneNumber
  admin.note = row.note
  admin.status = row.status
}
const adminForm = ref<FormInstance>();
function handleDialogConfirm(formEl: FormInstance | undefined) {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 表单校验
    if (!formEl) return;
    if (isEdit.value) {
      formEl.validate(valid => {
        if (valid) {
          updateAdmin(admin.id, admin).then(response => {
            ElMessage({
              message: '修改成功！',
              type: 'success'
            });
            dialogVisible.value = false;
            getList();
          })
        } else {
          console.log('参数验证不合法！');
          return false
        }
      })
    } else {
      formEl.validate(valid => {
        if (valid) {
          createAdmin(admin).then(response => {
            ElMessage({
              message: '添加成功！',
              type: 'success'
            });
            dialogVisible.value = false;
            getList();
          })
        } else {
          console.log('参数验证不合法！');
          return false
        }
      })
    }
  })
}
function handleAllocDialogConfirm() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = new URLSearchParams();
    params.append("adminId", allocAdminId.value as unknown as string);
    params.append("roleIds", allocRoleIds as unknown as string);
    allocRole(params).then(response => {
      ElMessage({
        message: '分配成功！',
        type: 'success'
      });
      allocDialogVisible.value = false;
    })
  })
}
function handleSelectRole(row: UserTableMode) {
  allocAdminId.value = row.id;
  allocDialogVisible.value = true;
  getRoleListByAdmin(row.id);
}
function getList() {
  listLoading.value = true;
  fetchList({ keyword: listQuery.keyword, depId: listQuery.depId, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}
function getAllRoleList() {
  fetchAllRoleList().then(response => {
    allRoleList.value = response.data;
  });
}
function handleSelectionChange(val: UserTableMode[]) {
  multipleSelection.value = val;
  multipleSelectionId.value = [];
  multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}
function batchDelete() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleBatchDelete(multipleSelectionId.value).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    })
  })
}
function getRoleListByAdmin(adminId: number) {
  getRoleByAdmin(adminId).then(response => {
    let allocRoleList = response.data;
    allocRoleIds.value = [];
    if (allocRoleList != null && allocRoleList.length > 0) {
      for (let i = 0; i < allocRoleList.length; i++) {
        allocRoleIds.value.push(allocRoleList[i].id);
      }
    }
  });
}

getList();
getAllRoleList();
getDepSelector();

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

</script>
<style></style>


