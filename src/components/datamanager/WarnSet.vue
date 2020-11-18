<template>
    <el-dialog
    title="预警设置"
    :visible.sync="dialogVisible"
    @close = "resetForm('warnSetRef')"
    width="30%">
    <el-form label-position="top" :model="warnSetFrom" ref="warnSetRef" :rules="warnSetRules">
      <el-form-item label="持续天数" prop="date">
        <el-input v-model="warnSetFrom.date" placeholder="请输入持续天数"></el-input>
      </el-form-item>
      <el-form-item label="roi预警值" prop="roi">
        <el-input v-model="warnSetFrom.roi" placeholder="请输入roi预警值"></el-input>
      </el-form-item>
      <el-form-item label="访问权限">
        <el-radio-group v-model="warnSetFrom.radio">
          <el-radio :label="1">关闭</el-radio>
          <el-radio :label="2">开启</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('warnSetRef')">取 消</el-button>
      <el-button type="primary" @click="submitForm('warnSetRef')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      dialogVisible:false,
      warnSetFrom:{
        
      },
      warnSetRules:{
        date:[
          {required: true, message: '请输入持续天数', trigger: 'blur'}
        ],
        roi:[
          {required: true, message: '请输入roi预警值', trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.$bus.on('openWarnSet',(value)=>{
      this.dialogVisible = value
    });
  },
  methods:{

    // 提交添加
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!!');
          this.dialogVisible = false
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
    },

    // 或者数据
    getDataList(id){
      
    }
    
  },
  beforeDestroy () {
    this.$bus.off('openWarnSet');
  },
  components:{
    
  }
}
</script>


<style scoped>
  
</style>
