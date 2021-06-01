import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VkAuthSuccess from '../views/VkAuthSuccess.vue'
import PageNotFound from '../components/PageNotFound.vue'
import AboutPage from '../components/About.vue'

import BudgetMain from '../views/budget/BudgetMain.vue'
import BudgetBoardDetail from '../views/budget/BudgetBoardDetail.vue'
import BudgetBoardSettings from '../views/budget/BudgetBoardSettings.vue'

import PurposeList from '../views/purpose/PurposeList.vue'
import PurposeDetail from '../views/purpose/PurposeDetail.vue'
import PurposeSettings from '../views/purpose/PurposeSettings.vue'

import ProjectList from '../views/todo/ProjectList.vue'
import ProjectDetail from '../views/todo/ProjectDetail.vue'

import store from "@/store/index";

Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        name: 'PageNotFound',
        component: PageNotFound,
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/auth/vk/success',
        name: 'VkAuthSuccess',
        component: VkAuthSuccess,
        meta: {
            public: true,
        },
    },
    {
        path: '/budget/board/:url/',
        name: 'BudgetBoardDetail',
        component: BudgetBoardDetail,
    },
    {
        path: '/budget/board/:url/settings',
        name: 'BudgetBoardSettings',
        component: BudgetBoardSettings,
    },
    {
        path: '/budget',
        name: 'BudgetMain',
        component: BudgetMain
    },
    {
        path: '/purpose',
        name: 'PurposeList',
        component: PurposeList
    },
    {
        path: '/purpose/:url',
        name: 'PurposeDetail',
        component: PurposeDetail
    },
    {
        path: '/purpose/:url/settings',
        name: 'PurposeSettings',
        component: PurposeSettings
    },
    {
        path: '/todo-projects',
        name: 'TodoProjects',
        component: ProjectList
    },
    {
        path: '/todo-projects/:id',
        name: 'TodoProjectsDetail',
        component: ProjectDetail
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: AboutPage,
        meta: {
            public: true,
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    store.dispatch("tokenVerify")
    if (!to.meta.public && !store.getters.getToken) {
        return router.push('/about')
    }
    next();
});

export default router
