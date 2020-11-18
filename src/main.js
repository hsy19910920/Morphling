// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import App from './App'
import router from './router'

// axios 引入
// 测试地址
axios.defaults.baseURL = 'http://danshenliang.jinyihe.com/adminapi/'

// 线上地址
// axios.defaults.baseURL = 'http://morphling.huaxicreature.com/adminapi/'
Vue.prototype.$http = axios
// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token')
    if (token){ //判断token是否存在
      config.headers.Authorization = token;  //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code == 100) {
      router.replace('/login');
    }
    return response;
  },
  error => {
    if (error && error.response && error.response.status) {
      if(error.response.status!=200){
        Vue.prototype.$message.error('服务器连接失败！');
      }
    }
    return Promise.reject(error);
  }
);

// echarts 引入
Vue.prototype.$echarts = echarts


// bus 引入
import VueBus from 'vue-bus';

// 初始化样式
import '@/assets/css/reset.css';
import '@/assets/css/theme-chalk/index.css';

Vue.use(ELEMENT, { size: 'small' });
Vue.use(VueBus);

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


