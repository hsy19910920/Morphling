<template>
  <el-container>
    <el-header height="50px">
      <Header></Header>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Header from './common/Header'
export default {
  name: '',
  data () {
    return {
      
    }
  },
  components:{
    Header
  }
}
</script>


<style scoped>
  .el-container{
    height: 100%;
  }
  .el-header{
    padding: 0;
  }
</style>
