<template>
    <el-dialog
    title="编辑"
    :visible.sync="dialogVisible"
    @close = "resetForm('editBrandRef')"
    width="30%">
    <el-form label-position="top" :model="editBrandForm" ref="editBrandRef" :rules="editBrandRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="editBrandForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="pid" prop="pid">
        <el-input v-model="editBrandForm.pid" placeholder="请输入pid"></el-input>
      </el-form-item>
      <el-form-item label="访问权限">
        <el-checkbox-group v-model="editBrandForm.type">
          <el-checkbox label="1" name="type">admin</el-checkbox>
          <el-checkbox label="2" name="type">test</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('editBrandRef')">取 消</el-button>
      <el-button type="primary" @click="submitForm('editBrandRef')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      dialogVisible:false,
      editBrandForm:{
        type:[]
      },
      editBrandRules:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        pid:[
          {required: true, message: '请输入pid', trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.$bus.on('openEditBrand',(value)=>{
      this.dialogVisible = value.dialogVsb
      this.getDataList(value.id)
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
    this.$bus.off('openEditBrand');
  },
  components:{
    
  }
}
</script>


<style scoped>
  
</style>
