<template>
    <el-dialog
    title="编辑"
    :visible.sync="dialogVisible"
    @close = "resetForm('EditTaobaoRef')"
    width="30%">
    <el-form label-position="top" :model="EditTaobaoForm" ref="EditTaobaoRef" :rules="EditTaoaboRules">
      <el-form-item label="店铺名称" prop="jc_tbk_config_name">
        <el-input v-model="EditTaobaoForm.jc_tbk_config_name" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item label="session" prop="session">
        <el-input v-model="EditTaobaoForm.session" placeholder="请输入session"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('EditTaobaoRef')">取 消</el-button>
      <el-button type="primary" @click="submitForm('EditTaobaoRef')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      dialogVisible:false,
      EditTaobaoForm:{
        
      },
      EditTaoaboRules:{
        jc_tbk_config_name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        session:[
          {required: true, message: '请输入session', trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.$bus.on('openEditTaobao',(value)=>{
      this.dialogVisible = value.dialogVsb
      this.EditTaobaoForm = JSON.parse(JSON.stringify(value.row));
      
    });
    
  },
  methods:{
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const{data:res} = await this.$http.post('config/configEdit',{
            'name':this.EditTaobaoForm.jc_tbk_config_name,
            'session':this.EditTaobaoForm.session,
            'id':this.EditTaobaoForm.jc_tbk_config_id,
          })
          const result = res
          if(result.code !== 200){
            this.$message.error(result.msg);
            return
          }else{
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.dialogVisible = false
            this.$parent.getDataList(this.$parent.setpage);
          }
        } else {
          console.log('error submit!!');
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
    this.$bus.off('openEditTaobao');
  },
  components:{
    
  }
}
</script>


<style scoped>
  
</style>
