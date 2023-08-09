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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="部门名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加部门</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="depTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="部门名" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.depName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门经理" width="150" align="center">
          <template #default="scope">{{ scope.row.leadName }}</template>
        </el-table-column>
        <el-table-column label="经理电话" align="center">
          <template #default="scope">{{ scope.row.leadPhone }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template #default="scope">{{ scope.row.note }}</template>
        </el-table-column>
        <el-table-column label="操作" width="235" align="center">
          <template #default="scope">
            <!-- todo  handleSelectRole   ====》handleSelectDep  -->
            <el-button size="small" type="primary" @click="handleQueryPersonal(scope.row)">人员信息
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
    <el-dialog :title="isEdit ? '编辑部门' : '添加部门'" v-model="dialogVisible"  width="40%">
      <el-form :model="dept" ref="deptForm" label-width="150px" size="small">
        <el-form-item label="部门名称：" width="250">
          <el-input v-model="dept.depName"></el-input>
        </el-form-item>
        <el-form-item label="部门经理：" width="250">
          <el-input v-model="dept.leadName"></el-input>
        </el-form-item>
        <el-form-item label="经理电话："  width="250">
          <el-input v-model="dept.leadPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注："  width="250">
          <el-input v-model="dept.note" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击后 传部门id，返回人员信息  -->
    <el-dialog title="人员信息" v-model="allocDialogVisible" width="60%">
      <div class="table-container">
        <el-table ref="personalTable" :data="deptPersonnel" style="width: 100%;" v-loading="listLoading" border>
          <el-table-column label="姓名" align="center" width="100">
            <template #default="scope">{{ scope.row.nickName }}</template>
          </el-table-column>
          <el-table-column label="职务" align="center" width="230">
            <template #default="scope"><el-tag :type="scope.row.duty==='部门经理'?'warning':'success'">{{scope.row.duty}}</el-tag></template>
          </el-table-column>
          <el-table-column label="手机号" align="center" width="130">
            <template #default="scope">{{ scope.row.phoneNumber }}</template>
          </el-table-column>
          <el-table-column label="家庭住址" align="center" width="350">
            <template #default="scope">{{ scope.row.address }}</template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer class="dialog-footer">
          <el-pagination  background @size-change="handlePersonalSizeChange"
              @current-change="handlePersonalCurrentChange" layout="total, sizes,prev, pager, next,jumper"
              :current-page.sync="listPersonal.pageNum" :page-size="listPersonal.pageSize" :page-sizes="[10, 15, 20]"
              :total="deptPersonnelTotal">
            </el-pagination>
      </template>

    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive,watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import { createDep, getAllDep, depDetails, updateDep, deleteDep } from '@/api/dep';// 未来保留 部门
import { UserOfDep, DepInfo } from "@/mode/DepInfoMode";


const deptPersonnel = ref<UserOfDep[]>([])  //部门下的所有人员信息
const deptPersonnelTotal = ref(0);  //部门下的所有人员数量
const listQuery = reactive({ //部门列表
  keyword: ''
})
const listLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const allocDialogVisible = ref(false);
const total = ref(0);  ////部门数量

// 部门下用户列表  用于分页
const listPersonal = reactive({
  pageNum: 1,
  pageSize: 10,
  deptId: ''
});

// 未来保留 部门
const dept = reactive({
  id: '',
  depName: '',
  leadName: '',  //部门负责人
  leadPhone: '', //部门负责人联系方式
  note: '',      //备注
});
const list = ref<DepInfo[]>([])  //所有部门信息
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function handleResetSearch() {
  listQuery.keyword = '';
}
function handleSearchList() {
  paginationData.currentPage = 1;
  getList();
}

function handlePersonalSizeChange(val: number) {
  listPersonal.pageNum = 1;
  listPersonal.pageSize = val;
  getPersonalListByDep();
}
function handlePersonalCurrentChange(val: number) {
  listPersonal.pageNum = val;
  getPersonalListByDep();
}
function handleAdd() {
  dialogVisible.value = true;
  isEdit.value = false;
}
function handleDelete(row: DepInfo) {
  ElMessageBox.confirm('是否要删除该部门?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDep(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  });
}
function handleUpdate(row: DepInfo) {
  dialogVisible.value = true;
  isEdit.value = true;
  dept.id = row.id;
  dept.depName = row.depName
  dept.leadName = row.leadName
  dept.leadPhone = row.leadPhone
  dept.note = row.note
}
function handleDialogConfirm() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isEdit.value) {
      updateDep(dept.id, dept).then(response => {
        ElMessage({
          message: '修改成功！',
          type: 'success'
        });
        dialogVisible.value = false;
        getList();
      })
    } else {
      createDep(dept).then(response => {
        ElMessage({
          message: '添加成功！',
          type: 'success'
        });
        dialogVisible.value = false;
        getList();
      })
    }
  })
}

function handleQueryPersonal(row: DepInfo) {
  listPersonal.deptId = row.id;
  getPersonalListByDep();
  allocDialogVisible.value = true;
}

function getList() {
  listLoading.value = true;
  getAllDep({keyword:listQuery.keyword,pageSize:paginationData.pageSize,pageNum:paginationData.currentPage}).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}
// todo
function getPersonalListByDep() {
  depDetails(listPersonal).then(response => {
    deptPersonnel.value = response.data.list;
    deptPersonnelTotal.value = response.data.total;
  });
}

getList();

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

</script>
<style>
</style>


