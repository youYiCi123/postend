<template>
    <div style="margin-top: 50px">
        <el-form :model="prodContentParam" label-width="120px" style="width: 720px" size="default">
            <el-form-item label="产品图片：">
                <multi-upload  @input="getNewPic" :pic="selectProductPics"></multi-upload>
            </el-form-item>
            <el-form-item label="产品名称：">
                <el-input v-model="prodContentParam.prodName" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item label="产品类型：">
                <el-radio-group v-model="prodContentParam.prodType">
                    <el-radio v-for="item in options" :label=item.value>{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="检测原理：">
                <el-input type="textarea" v-model="prodContentParam.principle" placeholder="请输入新闻简介"></el-input>
            </el-form-item>
            <el-form-item label="特点：">
                <el-input v-model="prodContentParam.feature" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item label="注册证号：">
                <el-input v-model="prodContentParam.registerCard" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item label="规格型号：">
                <el-input v-model="prodContentParam.model" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item label="有效期：">
                <el-input v-model="prodContentParam.expireDate" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item label="包装：">
                <el-input v-model="prodContentParam.pack" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-top: 50px;margin-left:1.6%;margin-bottom: 30px" size="small" type="primary"
                    @click="doSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineProps,computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { ISelectOption } from "@/mode/OptionMode";
import { SeriesMode } from "@/mode/SeriesMode";
import multiUpload from '@/components/Upload/multiUpload.vue'
import { listAll } from "@/api/prodSeries"
import { addProdContent, queryProdContent, updateProdContent } from '@/api/prod'

const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true
    }
})
const options = ref<ISelectOption[]>([])

const prodContentParam = reactive({
    id: 0,
    prodName: '',
    prodType: 0,
    pic: '',
    albumPics: '',//相册
    principle: '',//原理
    feature: '',//特点
    registerCard: '',//注册证号
    model: '',//规格型号
    expireDate: '',//有效期
    pack: ''//包装
})

const route = useRoute();
const router = useRouter();

function getNewPic(newValue: any) {
    if (newValue == null || newValue.length === 0) {
            prodContentParam.pic = '';
            prodContentParam.albumPics = '';
        } else {
            prodContentParam.pic = newValue[0];
            prodContentParam.albumPics = '';
            if (newValue.length > 1) {
                for (let i = 1; i < newValue.length; i++) {
                    prodContentParam.albumPics += newValue[i];
                    if (i !== newValue.length - 1) {
                        prodContentParam.albumPics += ',';
                    }
                }
            }
        }
}

//商品的主图和画册图片
const selectProductPics = computed(() => {
        const pics = reactive<string[]>([])
        if (prodContentParam.pic === undefined || prodContentParam.pic == null || prodContentParam.pic === '') {
            return pics;
        }
        pics.push(prodContentParam.pic);
        if (prodContentParam.albumPics === undefined || prodContentParam.albumPics == null || prodContentParam.albumPics === '') {
            return pics;
        }
        let albumPics = prodContentParam.albumPics.split(',');
        for (let i = 0; i < albumPics.length; i++) {
            pics.push(albumPics[i]);
        }
        return pics;
})

function getSelectOption() {
    listAll().then(response => {
        response.data.forEach((t: SeriesMode) => {
            options.value.push({ value: t.id, label: t.seriesName })
        })
    });
}
getSelectOption();

function doSubmit() {
    if (props.isEdit) {
        prodContentParam.id = route.query.id as unknown as number
        updateProdContent(prodContentParam).then(res => {
            ElNotification({
                title: '修改成功',
                type: 'success',
                duration: 2500
            })
            router.back();
        }).catch(
            err => {
                console.log(err.response.data.message)
            })
    } else {
        addProdContent(prodContentParam).then(res => {
            ElNotification({
                title: '添加成功',
                type: 'success',
                duration: 2500
            })
            router.back();
        }).catch(err => {
            console.log(err.response.data.message)
        })
    }
}

function getContentInfo() {
    if (props.isEdit) {
        queryProdContent(route.query.id).then(
            res => {
                if (res.data != null) {    //如果能取出值，则点击提交按钮时为修改操作，否则为提交操作
                    prodContentParam.id = res.data.prodId;
                    prodContentParam.prodName = res.data.prodName;
                    prodContentParam.pic = res.data.pic;
                    prodContentParam.albumPics = res.data.albumPics;
                    prodContentParam.prodType = res.data.prodType;
                    prodContentParam.principle = res.data.principle;//原理
                    prodContentParam.feature = res.data.feature;//特点
                    prodContentParam.registerCard = res.data.registerCard;//注册证号
                    prodContentParam.model = res.data.model;//规格型号
                    prodContentParam.expireDate = res.data.expireDate;//有效期
                    prodContentParam.pack = res.data.pack;//包装
                }
            }
        )
    }
}

getContentInfo()

</script>