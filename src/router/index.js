import vue from 'vue'
import vuerouter from 'vue-router'
import Home from '@/components/HelloWorld'
import login from '@/components/pages/login'
import DashBoard from '@/components/DashBoard'
import Productlist from '@/components/pages/Productlist'

vue.use(vuerouter);

export default new vuerouter({
    routes:[
        {
            path:'*',
            redirect:'/login'
        },
        {
            name:'home',
            path:'/',
            component: Home,
            meta:{requiresAuth: true}
        },
        {
            name:'admin',
            path:'/admin',
            component: DashBoard,
            meta:{requiresAuth: true},
            children:[{
                name:'Productlist',
                path:'Productlist',
                component: Productlist,
                meta:{requiresAuth: true}
            }]
            
        },
        {
            name:'login',
            path:'/login',
            component: login
        }
]
})