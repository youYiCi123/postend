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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="职位名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
      <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" 
      @selection-change="handleSelectionChange" v-loading="listLoading" stripe border>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="职位名称"  align="center">
          <template #default="scope">{{ scope.row.recruitName }}</template>
        </el-table-column>
        <el-table-column label="薪水" width="160" align="center">
          <template #default="scope">{{ scope.row.salary }}</template>
        </el-table-column>
        <el-table-column label="发布时间" width="160" align="center">
          <template #default="scope">
            <span v-html="timeFormat(scope.row.releaseDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
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
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from "dayjs";
import { usePagination } from "@/hooks/usePagination";
import { JobTableMode } from "@/mode/JobMode";
import { fetchList,deleteJob,handleBatchDelete} from '@/api/job';

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

let listQuery = reactive({
  keyword: null
})

const list = ref<JobTableMode[]>([])
const listLoading = ref(false);
const total = ref(0);
const router = useRouter();
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<JobTableMode[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

function timeFormat(time: string) {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function handleSearchList() {
  paginationData.currentPage = 1;
  getList();
}

function handleResetSearch() {
  listQuery.keyword = null
  paginationData.currentPage = 1
}

function handleAdd() {
    router.push('/concept/jobContentAdd');
}

function handleUpdate(row: JobTableMode) {
    router.push({ path: '/concept/jobContentUpdate', query: { id: row.id } });
}

function handleDelete(row: JobTableMode) {
  ElMessageBox.confirm('是否要删除该角色?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteJob(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  });
}

function handleSelectionChange(val: JobTableMode[]) {
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

function getList() {
  listLoading.value = true;
  fetchList({keyword:listQuery.keyword,pageSize:paginationData.pageSize,pageNum:paginationData.currentPage}).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

getList()
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

</script>