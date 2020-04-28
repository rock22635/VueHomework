import vue from 'vue'
import vuerouter from 'vue-router'
import Home from '@/components/HelloWorld'
import login from '@/components/pages/login'

vue.use(vuerouter);

export default new vuerouter({
    routes:[{
        name:'home',
        path:'/',
        component: Home
    },
    {
        name:'login',
        path:'/login',
        component: login
    }
]
})