<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index)  in levelList" :key="item.path" v-show="item.meta.title">
        <span v-if="item.redirect === 'noredirect' || index == levelList.length - 1"
          class="no-redirect">{{ item.meta.title }}</span>
        <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { watch,ref } from "vue";
import { useRoute,RouteLocationMatched } from 'vue-router'; 
let levelList = ref([] as Array<RouteLocationMatched>);
const route = useRoute();
function getBreadcrumb() {
  let matched = route.matched.filter(item => item.name)
  const first = matched[0]
  if (first && first.name !== 'home') {
    matched = [{ path: '/home', meta: { title: '首页' } }  as unknown as RouteLocationMatched].concat(matched)
  }
  levelList.value = matched
};
watch(
  () => route.path,
  () => {
    getBreadcrumb()
    }
)
getBreadcrumb();
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
