<template>
  <div style="margin-top: 50px">
    <el-form :model="newsContentParam" label-width="120px" style="width: 720px" size="default">
      <el-form-item label="新闻封面：">
        <single-upload @input="getNewPic" :pic="newsContentParam.pic"></single-upload>
      </el-form-item>
      <el-form-item label="新闻标题：">
        <el-input v-model="newsContentParam.theme" placeholder="请输入新闻标题"></el-input>
      </el-form-item>
      <el-form-item label="新闻类型：">
          <el-radio-group v-model="newsContentParam.newsType">
            <el-radio v-for="item in options" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      <el-form-item label="新闻简介：">
        <el-input type="textarea" v-model="newsContentParam.introduction" placeholder="请输入新闻简介"></el-input>
      </el-form-item>
      <el-form-item label="新闻内容：">
        <component :is="loadEdit" @change="getNewContent" :styleSize="'1'" :content="newsContentParam.content"></component>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-top: 50px;margin-left:1.6%;margin-bottom: 30px" size="small" type="primary"
          @click="doSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, shallowRef, defineProps } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { getUserName } from '@/utils/auth' // 验权
import { ElNotification } from 'element-plus';
import { ISelectOption } from "@/mode/OptionMode";
import { SeriesMode } from "@/mode/SeriesMode";
import singleUpload from '@/components/Upload/singleUpload.vue'
import WangEdit from '@/components/wangEdit/index.vue'
import { listAll } from "@/api/newsSeries"
import { addNewsContent, queryNewsContent, updateNewsContent } from '@/api/news'

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true
  }
})

const newsContentParam = reactive({
  newsId: 0,
  theme: '',//主题
  newsType:1,//新闻类型
  introduction: '', //简介
  pic: '',//封面图片
  content: '',
})
const loadEdit = shallowRef(WangEdit); //加载的组件-解决wangEdit从后台拿到数据后，页面渲染不出的问题
const route = useRoute();
const router = useRouter();

const options = ref<ISelectOption[]>([])
function doSubmit() {
  newsContentParam.newsId = route.query.id as unknown as number
  if (props.isEdit) {
    updateNewsContent(newsContentParam).then(res => {
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
    const userName=getUserName()
    console.log('上传图片路径',newsContentParam.pic)
    addNewsContent({theme:newsContentParam.theme,newsType:newsContentParam.newsType,
      introduce:newsContentParam.introduction,pic:newsContentParam.pic,
      content:newsContentParam.content,userName:userName}).then(res => {
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
    queryNewsContent(route.query.id).then(
      res => {
        if (res.data != null) {    //如果能取出值，则点击提交按钮时为修改操作，否则为提交操作
          newsContentParam.pic = res.data.pic;
          newsContentParam.content = res.data.content;
          newsContentParam.newsType = res.data.newsType;
          newsContentParam.theme = res.data.theme;
          newsContentParam.introduction = res.data.introduce;
        }
        loadEdit.value = WangEdit//请求成功，加载子组件
      },
    )
  }
}
function getNewPic(pic: any) {
  newsContentParam.pic = pic;
}
function getNewContent(content: any) {
  newsContentParam.content = content;
}

function getSelectOption() {
    listAll().then(response => {
        response.data.forEach((t:SeriesMode)=>{
            options.value.push({value:t.id,label:t.seriesName})
        })
    });
}
getSelectOption();
getContentInfo();

</script>
<style>

</style>