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
              <el-input v-model="listQuery.keyword" class="input-width" placeholder="企业理念名称" clearable></el-input>
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
        <el-table ref="IdeaTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
          <el-table-column label="理念名称" align="center">
            <template #default="scope">{{ scope.row.title }}</template>
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
      <el-dialog :title="isEdit ? '编辑理念' : '添加理念'" v-model="dialogVisible" width="40%">
        <el-form :model="concept">
          <el-form-item label="理念名称：" label-width="100px">
            <el-input v-model="concept.title" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="理念描述：" label-width="100px">
            <el-input type="textarea" :rows="3" v-model="concept.serviceDesc" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="理念Icon：" label-width="100px">
            <single-upload @input="getNewIconPic" :pic="concept.iconUrl"></single-upload>
          </el-form-item>
          <el-form-item label="对应照片：" label-width="100px">
            <single-upload @input="getNewImgPic" :pic="concept.imgUrl"></single-upload>
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
  import { usePagination } from "@/hooks/usePagination";
  import { ElMessage, ElMessageBox } from 'element-plus';
  const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
  import { ConceptIdea } from "@/mode/Concept";
  import singleUpload from '@/components/Upload/singleUpload.vue'
  import { fetchList, addConceptIdea, updateConceptIdea, delConceptIdea } from '@/api/concept';
  let listQuery = reactive({
    keyword: null
  })
  
  const concept = reactive({
    id: -1,
    title: '',
    serviceDesc: '',
    iconUrl: '',
    imgUrl:''
  });
  
  const listLoading = ref(false);
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const total = ref(0);
  const list = ref<ConceptIdea[]>([])
  
  function handleSearchList() {
    paginationData.currentPage = 1;
    getList();
  }
  
  function handleResetSearch() {
    listQuery.keyword = null
    paginationData.currentPage = 1
  }
  
  function getNewIconPic(pic: any) {
    concept.iconUrl = pic;
  }

  function getNewImgPic(pic: any) {
    concept.imgUrl = pic;
  }
  
  function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
    concept.id = -1,
      concept.title = '',
      concept.serviceDesc = '',
      concept.iconUrl = '',
      concept.imgUrl = ''
  }
  
  function handleUpdate(row: ConceptIdea) {
    dialogVisible.value = true;
    isEdit.value = true;
    concept.id = row.id
    concept.title = row.title
    concept.serviceDesc = row.serviceDesc
    concept.iconUrl = row.iconUrl
    concept.imgUrl = row.imgUrl
  }
  
  function handleDelete(row: ConceptIdea) {
    ElMessageBox.confirm('是否要删除该类型?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delConceptIdea(row.id).then(response => {
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
        updateConceptIdea(concept.id, concept).then(response => {
          ElMessage({
            message: '修改成功！',
            type: 'success'
          });
          dialogVisible.value = false;
          getList();
        })
      } else {
        addConceptIdea(concept).then(response => {
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