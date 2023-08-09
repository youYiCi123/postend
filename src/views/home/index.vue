<template>
    <div class="app-container">
        <el-row class="panel-group" :gutter="20">
            <el-col :span="8">
                <el-card>
                    <ChinaChart v-if="flag" @clickCityNode="getHospitalByCity" :businessData="chinaMapData" :height="500">
                    </ChinaChart>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card>
                    <TreeChart v-if="flag1" :treeData="treeData" :height="500"></TreeChart>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <!-- <Bar v-if="flag2"></Bar> -->
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="服务医院详情" v-model="dialogVisible" width="80%">
            <el-table ref="hospitalTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
                <el-table-column label="医院名称" width="200" align="center">
                    <template #default="scope"><el-tag>{{ scope.row.hospitalName }}</el-tag></template>
                </el-table-column>
                <el-table-column label="主任姓名" width="100" align="center">
                    <template #default="scope">{{ scope.row.directorName }}</template>
                </el-table-column>
                <el-table-column label="联系方式" width="130" align="center">
                    <template #default="scope">{{ scope.row.directorPhone }}</template>
                </el-table-column>
                <el-table-column label="服务项目" width="200" align="center">
                    <template #default="scope"><el-tag type='warning'>{{ scope.row.serviceName }}</el-tag></template>
                </el-table-column>
                <el-table-column label="设备型号/编号" width="150" align="center">
                    <template #default="scope">{{ scope.row.equipmentModel }}</template>
                </el-table-column>
                <el-table-column label="地址" width="420" align="center">
                    <template #default="scope">
                        <span v-html="formatAddress(scope.row)"></span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import TreeChart from '@/components/Echart/TreeChart.vue'
import Bar from '@/components/Echart/Bar.vue'
import ChinaChart from '@/components/Echart/ChinaChart.vue'
import geoCoordMap from '@/utils/city2coord.json'
import { getDashboard } from "@/api/dashboard";
import { Hospital } from "@/mode/Hospital";
import { fetchHospitalList } from '@/api/hospital';
import { ref, reactive, defineExpose, watch, onMounted, inject } from 'vue'

const flag = ref(false);
const flag1 = ref(false);
const flag2 = ref(false);

let chinaMapData = reactive<object[]>([])
const listQuery = reactive({
    pageNum: 1,
    pageSize: 10,
    city: ''
})
const listLoading = ref(false);
const list = ref<Hospital[]>([])  //所有信息
const total = ref(0);  ////数量
const dialogVisible = ref(false);
const treeData = ref({
    name: '总部',
    children: [] as any[] // 属性需要做类型断言处理
})

function getData() {
    getDashboard().then(res => {
        //渲染医院业务地图地图数据
        chinaMapData = convertCityData(res.data.cityHospital)
        //渲染企业内部架构数据
        let depUserArray=convertCompanyData(res.data.depUserRelationList)
        for (let index = 0; index < depUserArray.length; index++) {
            const element = depUserArray[index];
            treeData.value.children.push(element)
        }
        flag.value = true
        flag1.value = true
        flag2.value = true
    })
}
function convertCityData(data: any) {
    let res = []
    for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].city]
        if (geoCoord) {
            res.push({
                name: data[i].city,
                value: geoCoord,
                count: data[i].count
            })
        }
    }
    return res
}

function convertCompanyData(data: any) {
    let personList = []
    for (let i = 0; i < data.length; i++) {
        let children = [];
        if (data[i].userRelationList != null && data[i].userRelationList.length > 0) {
            for (let j = 0; j < data[i].userRelationList.length; j++) {
                children.push({ name: data[i].userRelationList[j].nickName, value: null });
            }
        }
        personList.push({ name: data[i].depName, value: data[i].userRelationList.length, children: children });
    }
    return personList
}

function formatAddress(hospital: Hospital) {
    let str = hospital.receiverProvince;
    if (hospital.receiverCity != null) {
        str += "  " + hospital.receiverCity;
    }
    str += "  " + hospital.receiverRegion;
    if (hospital.receiverDetailAddress !== null) {
        str += "  " + hospital.receiverDetailAddress;
    }
    return str;
}

function getHospitalList() {
    fetchHospitalList(listQuery).then(response => {
        listLoading.value = false;
        dialogVisible.value = true;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

function getHospitalByCity(data: any) {
    if (data !== undefined) {
        listQuery.city = data.name
        getHospitalList()
    }
}
function handleSizeChange(val: number) {
    listQuery.pageNum = 1;
    listQuery.pageSize = val;
    getHospitalList();
}

function handleCurrentChange(val: number) {
    listQuery.pageNum = val;
    getHospitalList();
}


getData()
</script>
<style scoped></style>