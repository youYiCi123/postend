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
        <el-form :inline="true" :model="listQuery"  label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="医院名称" clearable></el-input>
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
      <!-- 医院名称、服务项目、设备型号/编号、主任姓名、联系方式、省、市、区、详细地址  <el-tag>-->
      <el-table ref="hospitalTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="医院名称" align="center">
          <template #default="scope"><el-tag>{{ scope.row.hospitalName }}</el-tag></template>
        </el-table-column>
        <el-table-column label="主任姓名" width="100" align="center">
          <template #default="scope">{{ scope.row.directorName }}</template>
        </el-table-column>
        <el-table-column label="联系方式" width="160" align="center">
          <template #default="scope">{{ scope.row.directorPhone }}</template>
        </el-table-column>
        <el-table-column label="服务项目" width="160" align="center">
          <template #default="scope"><el-tag type='warning'>{{ scope.row.serviceName }}</el-tag></template>
        </el-table-column>
        <el-table-column label="设备型号/编号" width="160" align="center">
          <template #default="scope">{{ scope.row.equipmentModel }}</template>
        </el-table-column>
        <el-table-column label="地址" width="200" align="center">
          <template #default="scope">
            <span v-html="formatAddress(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
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
      <el-form :model="hospital" ref="hospitalForm" :rules="hostialRules" label-width="150px">
        <el-form-item label="医院名称：" prop="hospitalName">
          <el-input v-model="hospital.hospitalName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="主任姓名：" prop="directorName">
          <el-input v-model="hospital.directorName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="主任电话：" prop="directorPhone">
          <el-input v-model="hospital.directorPhone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="服务项目：" prop="checkedArrar">
          <el-checkbox-group v-model="checkedArrar" style="width: 250px">
            <el-checkbox v-for="(item, index) in prodList" :label="item.prodName" :name="item.prodName"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="设备型号/编号：" prop="equipmentModel">
          <el-input v-model="hospital.equipmentModel" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="所在区域：" prop="receiverProvince">
          <v-distpicker :province="hospital.receiverProvince" :city="hospital.receiverCity"
            :area="hospital.receiverRegion" @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：" prop="receiverDetailAddress">
          <el-input v-model="hospital.receiverDetailAddress" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Hospital } from "@/mode/Hospital";
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { validateTelephone } from '@/utils/validate';
import { usePagination } from "@/hooks/usePagination";
import { fetchList, createHospital, updateHospital, deleteHospital } from '@/api/hospital';
import { getAllProd } from '@/api/prod';
import { ProdTable } from "@/mode/ProdMode";
import VDistpicker from "v-distpicker";
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
  keyword: ''
})

const hospital = reactive({
  id: '',
  // 医院名称
  hospitalName: '',
  // 主任姓名
  directorName: '',
  // 主任电话
  directorPhone: '',
  //业务名称 
  serviceName: '',
  //设备型号/编号
  equipmentModel: '',
  // 省、市、区、详细地址
  receiverDetailAddress: '',
  receiverProvince: '',
  receiverCity: '',
  receiverRegion: '',
})
const listLoading = ref(false);
const list = ref<Hospital[]>([])  //所有信息
const prodList = ref<ProdTable[]>([])
const total = ref(0);  ////数量
const dialogVisible = ref(false);
const isEdit = ref(false);

const checkedArrar = ref<string[]>([])  //所有信息


const hospitalForm = ref<FormInstance>();


/** 验证规则 */
const hostialRules: FormRules = {
  directorPhone: [{ required: true, trigger: 'blur', validator: validateTelephone }],
  hospitalName: [{ required: true, trigger: 'blur', message: '医院名称不能为空' }],
  directorName: [{ required: true, trigger: 'blur', message: '主任名称不能为空' }],
};

function handleResetSearch() {
  listQuery.keyword = '';
}

function handleSearchList() {
  paginationData.currentPage = 1
  getList();
}

function getProd() {
  getAllProd({}).then(response => {
    prodList.value = response.data.list;
  });
}

function formatAddress(hospital: any) {
  let str = hospital.receiverProvince;
  if (hospital.receiverCity != null) {
    str += "  " + hospital.receiverCity;
  }
  str += "  " + hospital.receiverRegion;
  str += "  " + hospital.receiverDetailAddress;
  return str;
}

function handleAdd() {
  dialogVisible.value = true;
  isEdit.value = false;
  hospital.id = ''
  hospital.directorName = ''
  hospital.directorPhone = ''
  hospital.hospitalName = ''
  hospital.receiverDetailAddress = ''
  hospital.equipmentModel = ''
  hospital.receiverProvince = ''
  hospital.receiverCity = ''
  hospital.receiverCity = ''
  checkedArrar.value=[]
}

function onSelectRegion(data: any) {
  hospital.receiverProvince = data.province.value;
  hospital.receiverCity = data.city.value;
  hospital.receiverRegion = data.area.value;
}

function handleDelete(index: number, row: any) {
  ElMessageBox.confirm('是否要删除该医院?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteHospital(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  });
}

function handleUpdate(index: number, row: any) {
  dialogVisible.value = true;
  isEdit.value = true;
  Object.assign(hospital, row);
  checkedArrar.value = hospital.serviceName.split(',');
}

function handleDialogConfirm() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    hospital.serviceName = checkedArrar.value.join(",")
    if (isEdit.value) {
      updateHospital(hospital.id, hospital).then(response => {
        ElMessage({
          message: '修改成功！',
          type: 'success'
        });
        dialogVisible.value = false;
        getList();
      })
    } else {
      createHospital(hospital).then(response => {
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
  fetchList(listQuery).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

getProd()
getList()
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)


</script>
<style></style>
  
  
  