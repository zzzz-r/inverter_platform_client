import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/platform',
        name: 'Platform',
        redirect: '/platform/home',
        component: () => import('@/views/Platform.vue'),
        children: [{
            path: 'home',
            name: 'HomeView',
            component: () => import("@/views/HomeView.vue"),
        },{
            path: 'plant',
            name: 'PlantList',
            component: () => import("@/views/PlantList.vue"),
        },{
            path: 'plantDetails',
            name: 'PlantDetails',
            component: () => import("@/views/PlantDetails.vue"),
            redirect: '/platform/plantDetails/board',
            children:[{
                path: 'board',
                name: 'PlantBoard',
                component: () => import("@/components/PlantBoard.vue"),
            },{
                path: 'devices',
                name: 'DeviceList',
                component: () => import("@/components/DeviceList.vue"),
            },{
                path: 'mi',
                name: 'MiBoard',
                component: () => import("@/components/MiBoard.vue"),
            }]
        },{
            path: 'user',
            name: 'User',
            component: () => import("@/views/User.vue"),
        },{
            path: 'alarm',
            name: 'Alarm',
            component: () => import("@/views/Alarm.vue"),
        }]
    },
    {
        path: '/test',
        name: 'test',
        component: () => import("@/views/test.vue")
    }
]

const router = new VueRouter({
    routes
})

export default router
