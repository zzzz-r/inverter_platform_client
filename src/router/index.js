import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },{
        path: '/403',
        name: '403',
        component: () => import('@/views/403.vue')
    },{
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue')
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
            meta: {
                navIndex: '1' // 导航栏页码
            }
        },{
            path: 'plant',
            name: 'PlantList',
            component: () => import("@/views/MyPlant.vue"),
            meta: {
                navIndex: '2' // 导航栏页码
            }
        },{
            path: 'plantDetails',
            name: 'PlantDetails',
            component: () => import("@/views/PlantDetails.vue"),
            redirect: '/platform/plantDetails/board',
            children:[{
                path: 'board',
                name: 'PlantBoard',
                component: () => import("@/components/PlantBoard.vue"),
                meta: {
                    navIndex: '2',
                    sideNavIndex: '1',
                },
            },{
                path: 'devices',
                name: 'DeviceList',
                component: () => import("@/components/DeviceList.vue"),
                meta: {
                    navIndex: '2',
                    sideNavIndex: '2',
                },
            },{
                path: 'mi',
                name: 'MiBoard',
                component: () => import("@/components/MiBoard.vue"),
                meta: {
                    navIndex: '2',
                    sideNavIndex: '2',
                },
            },{
                path: 'report',
                name: 'Report',
                component: () => import("@/components/Report.vue"),
                meta: {
                    navIndex: '2',
                    sideNavIndex: '3',
                },
            },{
                path: 'info',
                name: 'AboutPlant',
                component: () => import("@/components/AboutPlant.vue"),
                meta: {
                    navIndex: '2',
                    sideNavIndex: '4',
                },
            }]
        }, {
            path: 'user',
            name: 'User',
            component: () => import("@/views/User.vue"),
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

export const setPlusRoutes = function() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.type === 1) {
        const platformRoutes = router.options.routes.find(route => route.name === 'Platform')
        if (platformRoutes && !platformRoutes.children.some(child => child.name === 'Alarm')) {
            router.addRoute('Platform', {
                path: 'alarm',
                name: 'Alarm',
                component: () => import('@/views/Alarm.vue'),
                meta: {
                    navIndex: '3'
                }
            })
        }
        if (platformRoutes && !platformRoutes.children.some(child => child.name === 'Institute')) {
            router.addRoute('Platform', {
                path: 'institute',
                name: 'Institute',
                component: () => import('@/views/Institute.vue'),
                meta: {
                    navIndex: '4-1'
                }
            })
        }
        if (platformRoutes && !platformRoutes.children.some(child => child.name === 'InstituteUser')) {
            router.addRoute('Platform', {
                path: 'instituteUser',
                name: 'InstituteUser',
                component: () => import('@/views/InstituteUser.vue'),
                meta: {
                    navIndex: '4-2'
                }
            })
        }
        if (platformRoutes && !platformRoutes.children.some(child => child.name === 'NormalUser')) {
            router.addRoute('Platform', {
                path: 'customer',
                name: 'NormalUser',
                component: () => import('@/views/NormalUser.vue'),
                meta: {
                    navIndex: '4-3'
                }
            })
        }
    }
};

setPlusRoutes();

router.beforeEach((to, from, next) => {
    // 判断路由是否存在
    const matchedRoutes = router.getRoutes().map(route => route.path)
    if (matchedRoutes.includes(to.path)) {
        next()
    } else {
        next('/404')
    }

    if (to.path.startsWith('/platform/')) {
        const allowedRoutes = ['/platform/alarm', '/platform/institute', '/platform/instituteUser', '/platform/customer']
        if (allowedRoutes.includes(to.path)) {
            const user = JSON.parse(localStorage.getItem('user'))
            // 判断用户类型
            if (user && user.type === 1) {
                // 用户类型为 1，有权限访问 /platform 下的子路由
                return next()
            } else {
                // 没有权限访问该路由，重定向到无权限页面
                return next('/403')
            }
        }
    }
})

export default router
