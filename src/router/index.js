import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/home/Home');
const ShopCart = () => import('../views/shopcart/ShopCart');
const Category = () => import('../views/category/Category');
const Profile = () => import('../views/profile/Profile');
const Detail = () => import('../views/detail/Detail');
const Register = () => import('../views/profile/Register');
const Login = () => import('../views/profile/Login');
const Address = () => import('../views/profile/Address');
const AddressEdit = () => import('../views/profile/AddressEdit');
const CreateOrder = () => import('../views/order/CreateOrder');
const Order = () => import('../views/order/Order');
const OrderDetail = () => import('../views/order/OrderDetail');

import store from '../store';
import { Notify } from 'vant';
const routes = [
  {
    path: '',
    name: 'DefauleHome',
    component: Home,
    meta: {
      title: '图书兄弟'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '图书兄弟'
    }
  },{
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: '图书兄弟-商品分类'
    }
  },{
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: '图书兄弟-商品详情'
    }
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: ShopCart,
    meta: {
      title: '图书兄弟-购物车',
      isAuthRequired: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '图书兄弟-个人中心',
      isAuthRequired: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '图书兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '图书兄弟-用户注册'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title: '图书兄弟-地址管理',
      isAuthRequired: true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title: '图书兄弟-地址编辑',
      isAuthRequired: true
    }
  },
  {
    path: '/createOrder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: {
      title: '图书兄弟-订单预览',
      isAuthRequired: true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '图书兄弟-订单预览',
      isAuthRequired: true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: {
      title: '图书兄弟-订单列表',
      isAuthRequired: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next)=>{
  // 如果没有登录，在这里到login
  if(to.meta.isAuthRequired && store.state.user.isLogin==false){
    Notify("您还没有登录，请先登录");
    return next('/login');
  }else{
    
    next();
  }
  document.title = to.meta.title;
})

export default router
