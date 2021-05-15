import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VkAuthSuccess from '../views/VkAuthSuccess.vue'
import PageNotFound from '../components/PageNotFound.vue'

import BudgetMain from '../views/budget/BudgetMain.vue'
import BudgetBoardDetail from '../views/budget/BudgetBoardDetail.vue'
import BudgetBoardSettings from '../views/budget/BudgetBoardSettings.vue'

import PurposeList from '../views/purpose/PurposeList.vue'
import PurposeDetail from '../views/purpose/PurposeDetail.vue'
import PurposeSettings from '../views/purpose/PurposeSettings.vue'

import ProjectList from '../views/todo/ProjectList.vue'
import ProjectDetail from '../views/todo/ProjectDetail.vue'

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
        component: VkAuthSuccess
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
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
