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
                <el-form :inline="true" :model="listQuery" size="default">
                    <el-form-item label="创建时间">
                        <DateTimeRangePicker :date="listQuery.date" :setDate="setDate" />
                    </el-form-item>
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="请输入主题" clearable>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" height="500" stripe v-loading="listLoading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column  :show-overflow-tooltip="true" label="留言内容" align="center">
                    <template #default="scope">
                        {{ scope.row.content }}
                    </template>
                </el-table-column>
                <el-table-column label="留言人" width="130" align="center">
                    <template #default="scope">{{ scope.row.createdName }}</template>
                </el-table-column>
                <el-table-column label="联系方式" width="130" align="center">
                    <template #default="scope">{{ scope.row.phone }}</template>
                </el-table-column>
                <el-table-column label="留言时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createdTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
                    <template #default="scope">
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
import { useRouter } from 'vue-router'; //vue3路由跳转
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
import DateTimeRangePicker from '@/components/Time/DateTimeRangePicker.vue'
import { MessageTable } from "@/mode/Message";
import { getAllMessage, handleBatchDelete, deleteMessage } from "@/api/message"
const listQuery = reactive({
    date: [],
    keyword: ''
})
const listLoading = ref(false);
const list = ref<MessageTable[]>([])  //所有信息
const total = ref(0);  ////数量
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<MessageTable[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function handleResetSearch() {
    listQuery.date = [];
    listQuery.keyword = '';
}
function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}
function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getAllMessage({ keyword: listQuery.keyword, date: dateStr, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}
function handleDelete(row: MessageTable) {
    ElMessageBox.confirm('是否要删除该培训?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteMessage(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}

function setDate(value: any) {
    listQuery.date = value
}
function handleSelectionChange(val: any) {
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

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

getList()
</script>