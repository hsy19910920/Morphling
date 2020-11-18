<template>
    <el-dialog
    title="添加"
    :visible.sync="dialogVisible"
    @close = "resetForm('addTaobaoRef')"
    width="30%">
    <el-form label-position="top" :model="addTaobaoForm" ref="addTaobaoRef" :rules="addTaoaboRules">
      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="addTaobaoForm.name" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item label="session" prop="session">
        <el-input v-model="addTaobaoForm.session" placeholder="请输入session"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('addTaobaoRef')">取 消</el-button>
      <el-button type="primary" @click="submitForm('addTaobaoRef')" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      loading:false,
      dialogVisible:false,
      addTaobaoForm:{
        name:'',
        session:'',
      },
      addTaoaboRules:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        session:[
          {required: true, message: '请输入session', trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.$bus.on('openAddTaobao',(value)=>{
      this.dialogVisible = value
    });
    
  },
  methods:{
    // 提交添加
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading=true
          const{data:res} = await this.$http.post('config/configAdd',this.addTaobaoForm)
          const result = res
          if(result.code !== 200){
            this.$message.error(result.msg);
            this.loading=false
            return
          }else{
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.loading=false
            this.dialogVisible = false
            this.$parent.getDataList(1);
          }
        } else {
          this.loading=false
          return false;
        }
      });
    },


    // 关闭重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    }
  },
  beforeDestroy () {
    this.$bus.off('openAddTaobao');
  },
  components:{
    
  }
}
</script>


<style scoped>
  
</style>
