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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="技术系列类别名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="SeriesTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="技术系列类别" align="center">
          <template #default="scope">{{ scope.row.seriesName }}</template>
        </el-table-column>
        <el-table-column label="级别" width="120" align="center">
          <template #default="scope">
            <span v-html="levelFilter(scope.row.seriesLevel)"></span>
          </template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" v-if="disableNextLevel(scope.row.seriesLevel)"
              @click="handleShowNextLevel(scope.row)">查看下级
            </el-button>
            <el-button size="small" v-else type="primary" 
              @click="returnPreLevel()">查看上级
            </el-button>
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
    <el-dialog :title="isEdit ? '编辑问题' : '添加问题'" v-model="dialogVisible" width="40%">
      <el-form :model="questionSeries">
        <el-form-item label="问题名称：" label-width="150px">
          <el-input v-model="questionSeries.seriesName" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //vue3路由跳转
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox } from 'element-plus';
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
import { SolutionSeries } from "@/mode/SolutionMode";
import { fetchList, addSolutionSeries, updateSolutionSeries, delSolutionSeries } from '@/api/solution';
let listQuery = reactive({
  keyword: null,
  pageNum: paginationData.currentPage,
  pageSize: paginationData.pageSize
})

const questionSeries = reactive({
  id: -1,
  seriesName: '',
  level: 0
});

const listLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const total = ref(0);
const parentId = ref(0);
const list = ref<SolutionSeries[]>([])
const route = useRoute();
const router = useRouter();

function handleSearchList() {
  paginationData.currentPage = 1;
  listQuery.pageNum=1;
  getList();
}

function handleResetSearch() {
  listQuery.keyword = null
  paginationData.currentPage = 1
  listQuery.pageNum=1;
}

function handleAdd() {
  dialogVisible.value = true;
  isEdit.value = false;
  questionSeries.id = -1,
  questionSeries.seriesName = ''
}

function handleUpdate(row: SolutionSeries) {
  dialogVisible.value = true;
  isEdit.value = true;
  questionSeries.id = row.id
  questionSeries.seriesName = row.seriesName
}

function handleShowNextLevel(row: any) {
  router.push({ path: '/serve/solutionSeries', query: { parentId: row.id } })
}

function returnPreLevel(){
  router.back();
}

function resetParentId() {
  paginationData.currentPage = 1;
  if (route.query.parentId != null) {
    parentId.value = route.query.parentId as unknown as number;
  } else {
    parentId.value = 0;
  }
}

function levelFilter(value: Number) {
  if (value === 0) {
    return '一级';
  } else if (value === 1) {
    return '二级';
  }
}

function disableNextLevel(value: any) {
  if (value === 0) {
    return true;
  } else {
    return false;
  }
}

function handleDelete(row: SolutionSeries) {
  ElMessageBox.confirm('是否要删除该类型?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delSolutionSeries(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  });
}

function handleDialogConfirm() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isEdit.value) {
      updateSolutionSeries(questionSeries).then(response => {
        ElMessage({
          message: '修改成功！',
          type: 'success'
        });
        dialogVisible.value = false;
        getList();
      })
    } else {
      addSolutionSeries(parentId.value,questionSeries).then(response => {
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

function getList() {
  listLoading.value = true;
  fetchList(parentId.value,listQuery).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

// 监听路由地址变化
watch(
  () => route.query,
  () => {
    resetParentId();
    getList();
    }
)
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>