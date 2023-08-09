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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="技术问题" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="问题类别:">
                        <el-cascader :options="options" @change="serachQuestionBySeries" style="width: 350px" clearable></el-cascader>
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
                <el-table-column label="技术问题" align="center">
                    <template #default="scope">{{ scope.row.question }}</template>
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
            <el-form :model="questionInfo">
                <el-form-item label="问题类别:" label-width="150px">
                    <el-cascader :options="options" @change="selectSeriesValue" v-model="selectSeriesArray"
                        style="width: 350px"></el-cascader>
                </el-form-item>
                <el-form-item label="问题:" label-width="150px">
                    <el-input v-model="questionInfo.question" style="width: 350px"></el-input>
                </el-form-item>
                <el-form-item label="解决措施:" label-width="150px">
                    <el-input type="textarea" :rows="3" v-model="questionInfo.answer" style="width: 350px"></el-input>
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
import { Question } from "@/mode/Question";
import { fetchListWithChild } from '@/api/solution';
import { fetchList, getQuestion, addQuestion, updateQuestion, delQuestion } from '@/api/question';

let listQuery = reactive({
    solutionSeries: '',
    keyword: null
})

const questionInfo = reactive({
    id: -1,
    question: '',
    answer: '',
    viewCount: '',
    seriesId: '',
    firstLevel:''
});

const listLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const total = ref(0);
const list = ref<Question[]>([])
let options = ref<any[]>([])
let selectSeriesArray = ref<any[]>([]) //级联选择内容
let reductionSelectedSeries = ref<any[]>([])//重构产品选择级联关系

function handleSearchList() {
    paginationData.currentPage = 1;
    getList();
}

function handleResetSearch() {
    listQuery.keyword = null
    paginationData.currentPage = 1
}

//获取多级选择器的关联数据
getSolutionWithChild()

function getSolutionWithChild() {
    fetchListWithChild().then(response => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
                for (let j = 0; j < list[i].children.length; j++) {
                    children.push({ label: list[i].children[j].seriesName, value: list[i].children[j].id });
                }
            }
            options.value.push({ label: list[i].seriesName, value: list[i].id, children: children });
        }
    })
}

//搜索使用
function serachQuestionBySeries(newValue: any){
    if (newValue != null) {
        listQuery.solutionSeries = ''
        newValue.forEach((element: any) => {
            if (listQuery.solutionSeries != '') {
                listQuery.solutionSeries = listQuery.solutionSeries + ',' + element
            } else {
                listQuery.solutionSeries = element
            }
        });
    } else {
        listQuery.solutionSeries = '';
    }
}

function selectSeriesValue(newValue: any) {
    if (newValue != null) {
        questionInfo.seriesId = ''
        questionInfo.firstLevel=newValue[0]
        newValue.forEach((element: any) => {
            if (questionInfo.seriesId != '') {
                questionInfo.seriesId = questionInfo.seriesId + ',' + element
            } else {
                questionInfo.seriesId = element
            }
        });
    } else {
        questionInfo.seriesId = '';
    }
}


// 子找父 子节点信息中没有父节点
function findIndexArray(data: any, seriesId: String, indexArray: any) {
    let idArrs = seriesId.split(",")
    let arr = Array.from(indexArray);
    idArrs.forEach((t: any) => {
        arr = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].children != null && data[i].children.length > 0) {
                for (let j = 0; j < data[i].children.length; j++) {
                    if (data[i].children[j].value == t) {
                        reductionSelectedSeries.value.push(data[i].value, data[i].children[j].value)
                    }
                }
            }
        }
    })
    return reductionSelectedSeries;
}

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
    questionInfo.id = -1,
        questionInfo.question = '',
        questionInfo.answer = '',
        questionInfo.seriesId = ''
    selectSeriesArray.value = []
}

function handleUpdate(row: any) {
    dialogVisible.value = true;
    isEdit.value = true;
    questionInfo.id = row.id
    questionInfo.question = row.question
    questionInfo.answer = row.answer
    questionInfo.seriesId = row.seriesId

    selectSeriesArray.value = []
    selectSeriesArray = findIndexArray(options.value, questionInfo.seriesId, [])
}

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        delQuestion(row.id).then(response => {
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
            updateQuestion(questionInfo).then(response => {
                ElMessage({
                    message: '修改成功！',
                    type: 'success'
                });
                dialogVisible.value = false;
                getList();
            })
        } else {
            addQuestion(questionInfo).then(response => {
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
    fetchList({ keyWord: listQuery.keyword,solutionSeries:listQuery.solutionSeries, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>