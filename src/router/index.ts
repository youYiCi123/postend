import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { markRaw } from "vue";
/* Layout */
import Layout from "../views/layout/Layout.vue";

export const constantRouterMap: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {  title: "login",hidden: true,},
  },
  {
    path: "/404",
    component: () => import("@/views/404.vue"),
    meta: { title: "404", hidden: true}
  },
  {
    path: "",
    component: markRaw(Layout),
    redirect: "/home",
    meta: {},
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "首页", icon: "iconfont icon-shouyefill"},
      },
    ],
  },
];
export const asyncRouterMap: RouteRecordRaw[] = [
  {
    path: "/ums",
    component: markRaw(Layout),
    redirect: "/ums/admin",
    name: "ums",
    meta: { title: "权限", icon: "icon-user" },
    children: [
      {
        path: "admin",
        name: "admin",
        component: () => import("@/views/ums/admin/index.vue"),
        meta: { title: "用户列表", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "role",
        name: "role",
        component: () => import("@/views/ums/role/index.vue"),
        meta: { title: "角色列表", icon: "icon-edit-role"},
      },
      {
        path: 'dep',
        name: 'dep',
        component: () => import('@/views/dep/index.vue'),
        meta: { title: '部门列表', icon: "icon-shuyi_bumenguanli" }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu.vue'),
        meta: { title: '分配菜单',hidden: true },
      },
    ],
  },
  {
    path: "/aboutUS",
    component: markRaw(Layout),
    redirect: "/aboutUS/history",
    name: "aboutUS",
    meta: { title: "关于我们", icon: "icon-user" },
    children: [
      {
        path: "intro",
        name: "intro",
        component: () => import("@/views/aboutUs/introduce/index.vue"),
        meta: { title: "企业简介", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "history",
        name: "history",
        component: () => import("@/views/aboutUs/history/index.vue"),
        meta: { title: "企业历史", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "culture",
        name: "culture",
        component: () => import("@/views/aboutUs/culture/index.vue"),
        meta: { title: "企业文化", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "honor",
        name: "honor",
        component: () => import("@/views/aboutUs/honor/index.vue"),
        meta: { title: "荣誉资质", icon: "icon-24gf-portraitMaleInfo3"},
      },
    ]
  },
  {
    path: "/info",
    component: markRaw(Layout),
    redirect: "/info/news",
    name: "info",
    meta: { title: "资讯", icon: "icon-user" },
    children: [
      {
        path: "news",
        name: "news",
        component: () => import("@/views/news/newsList/index.vue"),
        meta: { title: "新闻列表", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "newsSeries",
        name: "newsSeries",
        component: () => import("@/views/news/newsSeries/index.vue"),
        meta: { title: "新闻类型", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "newsInfo",
        name: "newsInfo",
        component: () => import("@/views/news/newsInfo/index.vue"),
        meta: { title: "新闻列表",hidden: true,},
      },
      {
        name: "newsContentAdd",
        path: 'newsContentAdd',
        component: () => import('@/views/news/newsAdd/index.vue'),
        meta: { title: "新闻添加",hidden: true,},
      },
      {
        name: "newsContentUpdate",
        path: 'newsContentUpdate',
        component: () => import('@/views/news/newsUpdate/index.vue'),
        meta: { title: "新闻修改",hidden: true,},
      },
     
  ]
  },
  {
    path: "/concept",
    component: markRaw(Layout),
    redirect: "/concept/recruit",
    name: "concept",
    meta: { title: "招贤纳士", icon: "icon-user" },
    children: [
      { 
        name: "recruit",
        path: 'recruit',
        component: () => import('@/views/recruit/recruitList/index.vue'),
        meta: { title: "招聘信息", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        name: "jobContentAdd",
        path: 'jobContentAdd',
        component: () => import('@/views/recruit/recruitAdd/index.vue'),
        meta: { title: "招聘添加",hidden: true,},
      },
      {
        name: "jobContentUpdate",
        path: 'jobContentUpdate',
        component: () => import('@/views/recruit/recruitUpdate/index.vue'),
        meta: { title: "招聘修改",hidden: true,},
      },
      { 
        name: "talentConcept",
        path: 'talentConcept',
        component: () => import('@/views/recruit/talentConcept/index.vue'),
        meta: { title: "人才理念", icon: "icon-24gf-portraitMaleInfo3"},
      },

    ]
  },
  {
    path: "/prod",
    component: markRaw(Layout),
    redirect: "/prod/prodseries",
    name: "prod",
    meta: { title: "产品", icon: "icon-user" },
    children:[
      {
        path: "prodseries",
        name: "prodseries",
        component: () => import("@/views/prod/series/index.vue"),
        meta: { title: "系列类型", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "prodList",
        name: "prodList",
        component: () => import("@/views/prod/prodList/index.vue"),
        meta: { title: "系列类型", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "prodContentAdd",
        name: "prodContentAdd",
        component: () => import("@/views/prod/prodAdd/index.vue"),
        meta: { title: "产品添加",hidden: true},
      },
      {
        path: "prodContentUpdate",
        name: "prodContentUpdate",
        component: () => import("@/views/prod/prodUpdate/index.vue"),
        meta: { title: "产品修改",hidden: true},
      },
    ]
  },
  {
    path: "/serve",
    component: markRaw(Layout),
    redirect: "/serve/serveIdea",
    name: "serve",
    meta: { title: "技术支持", icon: "icon-user" },
    children:[
      {
        path: "serveIdea",
        name: "serveIdea",
        component: () => import("@/views/serve/serveIdeas/index.vue"),
        meta: { title: "服务理念", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "solutionSeries",
        name: "solutionSeries",
        component: () => import("@/views/serve/serveSolution/solutionSeries/index.vue"),
        meta: { title: "问题类型", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "question",
        name: "question",
        component: () => import("@/views/serve/serveSolution/question/index.vue"),
        meta: { title: "技术问题", icon: "icon-24gf-portraitMaleInfo3"},
      },
    ]
  },
  {
    path: "/other",
    component: markRaw(Layout),
    redirect: "/other/message",
    name: "other",
    meta: { title: "其它功能", icon: "icon-user" },
    children:[
      {
        path: "message",
        name: "message",
        component: () => import("@/views/other/message/index.vue"),
        meta: { title: "留言信息", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "hospital",
        name: "hospital",
        component: () => import("@/views/other/hospital/index.vue"),
        meta: { title: "业务管理", icon: "icon-24gf-portraitMaleInfo3"},
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // routes
  routes: constantRouterMap,
});

export default router;
