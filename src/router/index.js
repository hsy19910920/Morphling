
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',   //根路径
      redirect: '/login'   //重定向url地址
    },
    {
      path: '/main',
      name: 'main',
      component: resolve=>(require(["@/components/Main"],resolve)),
      redirect: '/advertdata',
      children: [
        {
          path: '/advertdata',
          name: 'advertdata',
          component: resolve=>(require(["@/components/datamanager/Advertdata"],resolve))
        },
        {
          path: '/branddata',
          name: 'branddata',
          component: resolve=>(require(["@/components/datamanager/Branddata"],resolve))
        },
        {
          path: '/jurisdata',
          name: 'jurisdata',
          component: resolve=>(require(["@/components/datamanager/Jurisdata"],resolve))
        },
        {
          path: '/taobaoconfig',
          name: 'taobaoconfig',
          component: resolve=>(require(["@/components/configure/Taobaoconfig"],resolve))
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: resolve=>(require(["@/components/user/Login"],resolve))
    }
  ]
})

// 路由跳转配置
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

// 路由守卫
router.beforeEach((to, form, next) => {
  const token = window.localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next({ name: 'login' })
    Vue.prototype.$message.error('已失效,请重新登录！');
  }else {
    next();
  }

  if( to.path === '/login'){
    window.localStorage.removeItem("userinfo");
    next();
  }
})



export default router;
