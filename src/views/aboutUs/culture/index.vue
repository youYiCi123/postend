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
              <el-input v-model="listQuery.keyword" class="input-width" placeholder="文化名称" clearable></el-input>
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
        <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
          <el-table-column label="文化" align="center">
            <template #default="scope"><el-tag type="success" style="cursor:pointer;">{{ scope.row.cultureName }}</el-tag></template>
          </el-table-column>
          <el-table-column label="排序" width="250" align="center">
            <template #default="scope">
              {{ scope.row.sort }}
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
      <el-dialog :title="isEdit ? '编辑文化' : '添加文化'" v-model="dialogVisible" width="40%">
        <el-form :model="culture">
          <el-form-item label="文化标题：" label-width="150px">
            <el-input v-model="culture.cultureName" style="width: 280px"></el-input>
          </el-form-item>
          <el-form-item label="描述：" label-width="150px">
            <el-input v-model="culture.cultureDesc" type="textarea" :rows="5" style="width: 280px"></el-input>
          </el-form-item>
          <el-form-item label="排序:" label-width="150px">
            <el-input-number v-model="culture.sort" :min="1" :max="30" />
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
  import { fetchList, createCulture, updateCulture, deleteCulture } from '@/api/culture';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { usePagination } from "@/hooks/usePagination";
  import { Culture } from "@/mode/Culture";
  let listQuery = reactive({
    keyword: null
  })
  
  const culture = reactive({
    id: -1,
    cultureName: '',
    cultureDesc: '',
    sort: 1
  });
  
  const listLoading = ref(false);
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const list = ref<Culture[]>([])
  const total = ref(0);
  const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
  
  function handleResetSearch() {
    listQuery.keyword = null
    paginationData.currentPage = 1
  }
  function handleSearchList() {
    paginationData.currentPage = 1;
    getList();
  }
  function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
    culture.id = -1,
    culture.cultureName = '',
    culture.cultureDesc = '',
    culture.sort = 1
  }
  
  function handleDelete(row: Culture) {
    ElMessageBox.confirm('是否要删除该文化?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
        deleteCulture(row.id).then(response => {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        });
        getList();
      });
    });
  }
  function handleUpdate(row: Culture) {
    dialogVisible.value = true;
    isEdit.value = true;
    culture.id = row.id
    culture.cultureName = row.cultureName
    culture.cultureDesc = row.cultureDesc
    culture.sort = row.sort
  }
  function handleDialogConfirm() {
    ElMessageBox.confirm('是否要确认?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
  
      if (isEdit.value) {
        updateCulture(culture.id, culture).then(response => {
          ElMessage({
            message: '修改成功！',
            type: 'success'
          });
          dialogVisible.value = false;
          getList();
        })
      } else {
        createCulture(culture).then(response => {
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
    fetchList({ keyword: listQuery.keyword, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
      listLoading.value = false;
      list.value = response.data.list;
      total.value = response.data.total;
    });
  }
  
  /** 监听分页参数的变化 */
  watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })
  
  </script>
  <style></style>
    
    
    