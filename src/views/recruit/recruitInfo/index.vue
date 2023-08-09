<template>
    <div style="margin-top: 20px">
        <el-form :model="recruitParam" label-width="120px" style="width: 720px" size="default">
            <el-form-item label="岗位名称:">
                <el-input v-model="recruitParam.recruitName" placeholder="请输入岗位名称"></el-input>
            </el-form-item>
            <el-form-item label="招聘人数:">
                <el-input-number v-model="recruitParam.recruitCount" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="招聘日期:">
                <el-date-picker v-model="recruitParam.releaseDate" type="date" placeholder="请选择招聘起始日期" />
            </el-form-item>
            <el-form-item label="薪水:">
                <el-input v-model="recruitParam.salary" placeholder="请填写薪水范围"></el-input>
            </el-form-item>
            <el-form-item label="岗位职责:">
                <WangEdit  @change="getDuty" :content="recruitParam.responsibility"></WangEdit>
            </el-form-item>
            <el-form-item label="任职要求:">
                <WangEdit @change="getOrder" :content="recruitParam.requirement"></WangEdit>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive ,defineProps} from "vue";
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import WangEdit from '@/components/wangEdit/index.vue'
import {addJobContent,queryJobContent, updateJobContent } from '@/api/job'

const recruitParam = reactive({
    id: 0,
    recruitName: '', //招聘岗位名称
    recruitCount: 1, //招聘人数
    releaseDate: '', //招聘起始日期
    salary: '',//薪水
    responsibility: '',//岗位职责
    requirement: '',//任职要求
})

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true
  }
})
const route = useRoute();
const router = useRouter();

function doSubmit() {
    recruitParam.id = route.query.id as unknown as number
  if (props.isEdit) {
    updateJobContent(recruitParam).then(res => {
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
    addJobContent({recruitName:recruitParam.recruitName,recruitCount:recruitParam.recruitCount,
        releaseDate:recruitParam.releaseDate,salary:recruitParam.salary,
      requirement:recruitParam.requirement,responsibility:recruitParam.responsibility}).then(res => {
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

function getDuty(content: any) {
  recruitParam.responsibility = content;
}

function getOrder(content: any) {
  recruitParam.requirement = content;
}


function getContentInfo() {
  if (props.isEdit) {
    queryJobContent(route.query.id).then(
      res => {
        if (res.data != null) {    //如果能取出值，则点击提交按钮时为修改操作，否则为提交操作
          recruitParam.recruitName = res.data.recruitName;
          recruitParam.recruitCount = res.data.recruitCount;
          recruitParam.releaseDate = res.data.releaseDate;
          recruitParam.salary = res.data.salary;
          recruitParam.responsibility = res.data.responsibility;
          recruitParam.requirement = res.data.requirement;
        }
      }
    )
  }
}

getContentInfo()

</script>