import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/index.vue'),
        meta: {
            title: "Ethscriptions Tools生态工具集合"
        }
    }, {
        path: '/batchMint',
        name: 'batchMint',
        component: () => import('@/views/index.vue'),
        meta: {
            title: "Ethscriptions Tools生态工具集合"
        }
    }, {
        path: '/batchTransfer',
        name: 'batchTransfer',
        component: () => import('@/views/index.vue'),
        meta: {
            title: "Ethscriptions Tools生态工具集合"
        }
    }
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router
