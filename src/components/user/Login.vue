<template>
  <div class="login">
    <div class="login_head">
      <a href="javascript:;" class="hd_text">Morphling <span>v3.0</span></a>
    </div>
    <div class="login_box">
      <h5 class="lg_title">系统管理</h5>
      <el-form ref="loginform" :model="loginform" :rules="loginRules" size="medium" @keyup.enter.native="submitForm('loginform')">
        <el-form-item prop="username">
          <el-input v-model="loginform.username" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginform.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="submitForm('loginform')" :disabled='disabled' :loading="disabled">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login_foot">
      <p>推荐使用谷歌浏览器</p>
      <p>©版权所有 2019-2020 Morphling</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      disabled:false,
      loginform:{
        username:'',
        password:''
      },
      loginRules:{
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      }
    };
  },
  created(){
    
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          this.disabled = true
          const {data:res} = await this.$http.post('login',this.loginform)
          const result = res
          if(result.code !== 200){
            this.disabled = false
            this.$message.error(result.msg);
          }else{
            const userinfo = result.data
            window.localStorage.setItem("token",result.data.token);
            window.localStorage.setItem("userinfo",JSON.stringify(userinfo));
            this.$router.push('/main')
            this.disabled = false
          }
        } else {
          this.disabled = false
          return false;
        }
      });
    },
  }
};
</script>


<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: url(../../assets/img/login_bg.jpg) no-repeat center;
  background-size: cover;
}
.login_box{
  width: 300px;
  position: absolute;
  top: 45%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}
.lg_title{
  text-align: center;
  font-size: 25px;
  color: #fff;
  letter-spacing:3px;
  text-shadow:#000 0.05em 0.05em 0.05em;
  margin-bottom: 20px;
}
.login_head{
  height: 47px;
  line-height: 47px;
  padding: 0 45px;
}
.hd_text{
  font-size: 18px;
  color: #fff;
  letter-spacing: 1px;
  text-decoration: none;
  text-shadow: #000 0.1em 0.1em 0.1em;
}
.hd_text span{
  font-size: 14px;
}
.login_foot{
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  font-size: 12px;
  color: #fff;
  text-shadow: #000 0.1em 0.1em 0.1em;
  line-height: 2;
  padding-bottom: 20px;
}
</style>
<style>
.login_box .el-input__icon{
  font-size: 16px;
}
</style>
