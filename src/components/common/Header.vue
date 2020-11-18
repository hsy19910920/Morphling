<template>
  <div class="header flexbox">
    <div class="hd_logo">
      Morphling
      <sup>v3.0</sup>
    </div>
    <div class="hd_nav">
      <el-menu
      router
      :default-active="currentUrl"
      mode="horizontal"
      background-color="#393D49"
      text-color="#fff"
      active-text-color="#2F88FF">
      <el-submenu index="2" v-if="userinfo.authorize=='3'">
        <template slot="title">系统管理</template>
        <el-submenu index="2-1">
          <template slot="title">系统配置</template>
          <el-menu-item index="/" disabled>系统参数配置</el-menu-item>
          <el-menu-item index="/" disabled>任务系统管理</el-menu-item>
          <el-menu-item index="/" disabled>系统日志管理</el-menu-item>
          <el-menu-item index="/" disabled>系统菜单管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2-2">
          <template slot="title">权限管理</template>
          <el-menu-item index="/" disabled>访问权限管理</el-menu-item>
          <el-menu-item index="/" disabled>系统任务管理</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="1" v-if="userinfo.authorize =='3' || userinfo.authorize =='1'">
        <template slot="title">配置信息</template>
        <el-menu-item index="/taobaoconfig">淘宝客平台配置</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">数据管理</template>
        <el-menu-item index="/advertdata">广告数据</el-menu-item>
        <el-menu-item index="/branddata">品牌数据</el-menu-item>
        <el-menu-item index="/jurisdata" v-if="userinfo.authorize =='3' || userinfo.authorize =='1'">广告授权</el-menu-item>
      </el-submenu>
      <!-- <template v-for="(menu,index) in menu">
        <el-submenu :key="menu.key" :index="menu.key" v-if="menu.sedchildren" >
            <template slot="title">
                <i :class="menu.icon"></i>
                <span slot="title">{{menu.label}}</span>
            </template>
            <template v-for="(sed,index) in menu.sedchildren">
              <el-submenu :key="sed.key" :index="sed.key" v-if="sed.threechildren" >
                <template slot="title">
                  <i :class="sed.icon"></i>
                  <span slot="title">{{sed.label}}</span>
                </template>
                <template v-for="(three,index) in sed.threechildren">
                  <el-menu-item :key="three.key" :index="three.key">
                    <i :class="menu.icon"></i>
                    <span slot="title">{{three.label}}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item :key="sed.key" :index="sed.key"   v-else>
                <i :class="sed.icon"></i>
                <span slot="title">{{sed.label}}</span>
              </el-menu-item>
            </template>
        </el-submenu>
        <el-menu-item :key="menu.key" :index="menu.key"   v-else>
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.label}}</span>
        </el-menu-item>
      </template> -->
    </el-menu>
    </div>
    <div class="hd_head">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar size="small" :src="userinfo.headimg" v-if="userinfo.headimg"></el-avatar>
          <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" v-else></el-avatar>
          {{userinfo.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item command="基本资料"><i class="el-icon-setting"></i> 基本资料</el-dropdown-item>
          <el-dropdown-item command="安全设置"><i class="el-icon-bangzhu"></i> 安全设置</el-dropdown-item>
          <el-dropdown-item command="缓存加速"><i class="el-icon-truck"></i> 缓存加速</el-dropdown-item>
          <el-dropdown-item command="清理缓存"><i class="el-icon-brush"></i> 清理缓存</el-dropdown-item> -->
          <el-dropdown-item command="退出登录"><i class="el-icon-switch-button"></i> 退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      currentUrl:'1',
      userinfo:{},
      // 导航结构
      menu:[
        {
          label:'系统管理',
          key:'1',
          icon:'',
          sedchildren:[
            {
              label:'系统配置',
              key:'1-1',
              icon:'',
              threechildren:[
                {label:'系统参数配置',key:'1-1-1',icon:''},
                {label:'任务系统管理',key:'1-1-2',icon:''},
                {label:'系统日志管理',key:'1-1-3',icon:''},
                {label:'系统菜单管理',key:'1-1-4',icon:''}
              ]
            },
            {
              label:'权限管理',
              key:'1-2',
              icon:'',
              threechildren:[
                {label:'访问权限管理',key:'1-2-1',icon:''},
                {label:'系统任务管理',key:'1-2-2',icon:''}
              ]
            }
          ]
        },
        {
          label:'数据管理',
          key:'3',
          icon:'',
          sedchildren:[
            {label:'广告数据',key:'/advertdata',icon:''},
            {label:'品牌数据',key:'/branddata',icon:''},
            {label:'广告授权',key:'/jurisdata',icon:''},
          ]
        },
      ]
      // 导航结构
    }
  },
  created(){
    const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    this.userinfo = userinfo
    this.getUrl();
  },
  methods:{
    // 选择子菜单保存路径
    getUrl(){
      const url = this.$route.path
      this.currentUrl = url
    },

    // 右侧子菜单
    handleCommand(command) {
      if(command=='退出登录'){
        this.$router.push('/login')
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userinfo");
      }
    }
  }
}
</script>


<style scoped>
  .header{
    height: 50px;
    background-color: #393D49;
  }
  .hd_logo{
    color: #fff;
    font-size: 18px;
    width: 199px;
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    line-height: 50px;
    text-align: center;
  }
  .hd_logo sup{
    font-size: 12px;
    padding-left: 5px;
  }
  .hd_nav{
    flex: 1;
    -webkit-flex: 1;
  }
  .el-dropdown-link{
    height: 50px;
    line-height: 50px;
    color: #fff;
    padding: 0 20px;
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    display: block;
  }
  .el-avatar{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .el-menu-item{
    height: 50px;
    line-height: 50px;
  }
  .el-menu{
    border-bottom:0;
  }
</style>
<style>
.hd_nav .el-submenu__title{
 height: 50px !important;
 line-height: 50px !important;
}
</style>
