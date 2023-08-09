<template>
    <div style="margin-top: 50px">
        <el-form :model="comanayParam" label-width="120px" style="width: 720px" size="default">
            <el-form-item label="荣誉相册：">
                <multi-upload  @input="getHonorPic" :pic="selectHonorPics"></multi-upload>
            </el-form-item>
            <el-form-item label="专利相册：">
                <multi-upload  @input="getPatentPic" :pic="selectPatentPics"></multi-upload>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-top: 50px;margin-left:1.6%;margin-bottom: 30px" size="small" type="primary"
                    @click="doSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import multiUpload from '@/components/Upload/multiUpload.vue'
import { ElNotification } from 'element-plus';
import { ref, reactive, computed } from "vue";
import {queryContent,updateContent,addContent } from '@/api/honor';

const comanayParam = reactive({
    id: 0,
    honorPics: '',//荣誉相册
    patentPics: '',//专利相册
})

const isEdit = ref(false);

//荣誉资质
function getHonorPic(newValue: any) {
    if (newValue == null || newValue.length === 0) {
        comanayParam.honorPics = '';
        } else {
            comanayParam.honorPics = '';
            if (newValue.length > 0) {
                for (let i = 0; i < newValue.length; i++) {
                    comanayParam.honorPics += newValue[i];
                    if (i !== newValue.length - 1) {
                        comanayParam.honorPics += ',';
                    }
                }
            }
        }
}

//荣誉资质
function getPatentPic(newValue: any) {
    if (newValue == null || newValue.length === 0) {
        comanayParam.patentPics = '';
        } else {
            comanayParam.patentPics = '';
            if (newValue.length > 0) {
                for (let i = 0; i < newValue.length; i++) {
                    comanayParam.patentPics += newValue[i];
                    if (i !== newValue.length - 1) {
                        comanayParam.patentPics += ',';
                    }
                }
            }
        }
}


//荣誉资质的主图和画册图片
const selectHonorPics = computed(() => {
        const pics = reactive<string[]>([])
        if (comanayParam.honorPics === undefined || comanayParam.honorPics == null || comanayParam.honorPics === '') {
            return pics;
        }
        let honorPics = comanayParam.honorPics.split(',');
        for (let i = 0; i < honorPics.length; i++) {
            pics.push(honorPics[i]);
        }
        return pics;
})

//荣誉资质的主图和画册图片
const selectPatentPics = computed(() => {
        const pics = reactive<string[]>([])
        if (comanayParam.patentPics === undefined || comanayParam.patentPics == null || comanayParam.patentPics === '') {
            return pics;
        }
        let patentPicsArray = comanayParam.patentPics.split(',');
        for (let i = 0; i < patentPicsArray.length; i++) {
            pics.push(patentPicsArray[i]);
        }
        return pics;
})

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
                    comanayParam.honorPics = res.data.honorPics;
                    comanayParam.patentPics = res.data.patentPics;
                }
            }
        )
}

getContentInfo()


</script>