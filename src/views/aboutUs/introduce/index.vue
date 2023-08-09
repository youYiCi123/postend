<template>
    <div style="margin-top: 50px">
        <el-form :model="comanayParam" label-width="120px" style="width: 720px" size="default">
            <el-form-item label="企业简介：">
                <el-input type="textarea" :rows="8" v-model="comanayParam.introduce" style="width: 600px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-left:1.6%;margin-bottom: 30px" size="small" type="primary"
                    @click="doSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { ref, reactive} from "vue";
import {queryContent,updateContent,addContent } from '@/api/honor';

const comanayParam = reactive({
    id: 0,
    introduce: ''//简介
})

const isEdit = ref(false);

function doSubmit() {
    if (isEdit.value) {
        updateContent(comanayParam).then(res => {
            ElNotification({
                title: '修改成功',
                type: 'success',
                duration: 2500
            })
        }).catch(
            err => {
                console.log(err.response.data.message)
            })
    } else {
        addContent(comanayParam).then(res => {
            ElNotification({
                title: '添加成功',
                type: 'success',
                duration: 2500
            })
        }).catch(err => {
            console.log(err.response.data.message)
        })
    }
}

function getContentInfo() {
        queryContent().then(
            res => {
                if (res.data != null) {    //如果能取出值，则点击提交按钮时为修改操作，否则为提交操作
                    isEdit.value=true;
                    comanayParam.id = res.data.id;
                    comanayParam.introduce = res.data.introduce;
                }
            }
        )
}

getContentInfo()

</script>
