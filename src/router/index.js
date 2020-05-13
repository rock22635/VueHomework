import vue from 'vue'
import vuerouter from 'vue-router'
import Home from '@/components/HelloWorld'
import login from '@/components/pages/login'
import DashBoard from '@/components/DashBoard'
import Productlist from '@/components/pages/Productlist'
import Orderlist from '@/components/pages/Orderlist'
import Voucher from '@/components/pages/Voucher'
import customorders from '@/components/pages/customorders'
vue.use(vuerouter);

export default new vuerouter({
    routes:[
        {
            path:'*',
            redirect:'/login'
        },
        {
            name:'admin',
            path:'/',
            component: Home,
            meta:{requiresAuth: true}
        },
        {
            name:'customorders',
            path:'/',
            component: DashBoard,
            meta:{requiresAuth: true},
            children:[{
                name:'customorder',
                path:'customorder',
                component: customorders,
                
            }]
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
            },
            {
                name:'Orderlist',
                path:'Orderlist',
                component: Orderlist,
                meta:{requiresAuth: true}
            },
            {
                name:'Voucher',
                path:'Voucher',
                component: Voucher,
                meta:{requiresAuth: true}
            },
        ]
            
        },
        {
            name:'login',
            path:'/login',
            component: login
        }
]
})