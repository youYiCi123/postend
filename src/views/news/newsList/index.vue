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
                    <el-form-item label="新闻类型：">
                        <el-select v-model="listQuery.newsType" clearable placeholder="新闻类型">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" class="btn-add" @click="handleAdd()"
                style="float:right; margin-bottom: 20px;margin-left: 20px">添加
            </el-button>
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" height="500" stripe v-loading="listLoading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="新闻标题" align="center">
                    <template #default="scope">
                        <div @click="handleSelectNews(scope.row)" class="file-name-content">
                            <el-tag type="success" style="cursor:pointer;">{{ scope.row.theme }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="编辑人" width="130" align="center">
                    <template #default="scope">{{ scope.row.createdAdminName }}</template>
                </el-table-column>
                <el-table-column label="创建时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createdTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" @click="handleContentUpdate(scope.row)">
                            编辑内容
                        </el-button>
                        <el-button size="small" type="primary" @click="handleSelectNews(scope.row)">详情
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
import { NewsTable } from "@/mode/NewsModel";
import { ISelectOption } from "@/mode/OptionMode";
import { SeriesMode } from "@/mode/SeriesMode";
import { getAllNews, handleBatchDelete, deleteNews } from "@/api/news"
import { listAll } from "@/api/newsSeries"
const listQuery = reactive({
    date: [],
    keyword: '',
    newsType: ''
})
const listLoading = ref(false);
const list = ref<NewsTable[]>([])  //所有新闻信息
const total = ref(0);  ////数量
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<NewsTable[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

const options = ref<ISelectOption[]>([])

const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function handleResetSearch() {
    listQuery.date = [];
    listQuery.keyword = '';
    listQuery.newsType = '';
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

function getSelectOption() {
    listAll().then(response => {
        response.data.forEach((t:SeriesMode)=>{
            options.value.push({value:t.id,label:t.seriesName})
        })
    });
}
getSelectOption() 
function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getAllNews({ keyword: listQuery.keyword, date: dateStr, newsType: listQuery.newsType, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}
function handleDelete(row: NewsTable) {
    ElMessageBox.confirm('是否要删除该培训?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteNews(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}
function handleAdd() {
    router.push('/info/newsContentAdd');
}

function handleContentUpdate(row: NewsTable) {
    router.push({ path: '/info/newsContentUpdate', query: { id: row.id } });
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
function handleSelectNews(row: NewsTable) {
    router.push({ path: '/info/newsInfo', query: { id: row.id } });
}


/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

getList()
</script>