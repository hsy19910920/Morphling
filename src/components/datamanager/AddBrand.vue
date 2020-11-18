<template>
    <el-dialog
    title="添加"
    :visible.sync="dialogVisible"
    @close = "resetForm('addBrandRef')"
    width="30%">
    <el-form label-position="top" :model="addBrandForm" ref="addBrandRef" :rules="addBrandRules" v-loading="loading">
      <el-form-item label="名称" prop="name">
        <el-input v-model="addBrandForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="pid" prop="pid">
        <el-input v-model="addBrandForm.pid" placeholder="请输入pid"></el-input>
      </el-form-item>
      <el-form-item label="访问权限" v-if="userinfo.authorize =='3' || userinfo.authorize =='1'">
        <el-input placeholder="请输入代理商账号" v-model="username" class="input-with-select" @keyup.enter.native="getAgentName">
          <el-button slot="append" icon="el-icon-search" @click="getAgentName"></el-button>
        </el-input>
        <div class="tab_list">
          <template v-if="addBrandForm.authorize.length>0">
            <el-tag size="small" v-for="(item,index) in addBrandForm.authorize" closable :key="index" @close="handleClose(index)">{{item.username}}</el-tag>
          </template>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('addBrandRef')">取 消</el-button>
      <el-button type="primary" @click="submitForm('addBrandRef')" :loading="sure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      sure:false,
      userinfo:{},
      checkList:[],
      dialogVisible:false,
      loading:false,
      addBrandForm:{
        name:'',
        pid:'',
        authorize:[]
      },
      username:'',
      addBrandRules:{
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
    const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    this.userinfo = userinfo

    this.$bus.on('openAddBrand',(value)=>{
      this.dialogVisible = value
    });

  },
  methods:{
    // 提交添加
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.sure = true
          const listarr = this.addBrandForm.authorize
          var ids = [];
          listarr.forEach(element =>{
            ids.push(element.id)
          })
          this.addBrandForm.authorize = ids
          const{data:res} = await this.$http.post('ad/brandAdd',this.addBrandForm)
          const result = res
          if(result.code !== 200){
            this.sure = false
            this.$message.error(result.msg);
            return
          }else{
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.sure = false
            this.dialogVisible = false
            this.$parent.getDataList();
          }
        } else {
          this.sure = false
          return false;
        }
      });
    },

    // 删除代理商
    handleClose(tag) {
      this.addBrandForm.authorize.splice(tag, 1);
    },


    // 搜索代理商
    async getAgentName(){
      if(!this.username){
        this.$message({
          message: '请输入要搜索的代理商账号！',
          type: 'warning'
        });
        return;
      }
      const{data:res} = await this.$http.post('ad/adverAlert',{'username':this.username})
      const result = res
      if(result.code !== 200){
        this.$message.error(result.msg);
        return
      }else{
        if(result.data.agenname==null){
          this.$message({
            message: '没有该数据！',
            type: 'warning'
          });
          return
        }
        else{
          const a = {}
          a.id = result.data.agenname.id
          a.username = result.data.agenname.username
          let b = this.addBrandForm.authorize
          for (let index = 0; index < b.length; index++) {
            const element = b[index].id;
            if(element==a.id){
              this.$message({
                message: '已添加该代理商账号！',
                type: 'warning'
              });
              return
            }
          }
          b.push(a)
          this.username = ''
          this.addBrandForm.authorize = b
        }
      }
    },

    // 关闭重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addBrandForm.authorize = []
      this.dialogVisible = false
    }
  },
  beforeDestroy () {
    this.$bus.off('openAddBrand');
  },
  components:{
    
  }
}
</script>


<style scoped>
  .el-tag{
    margin-right: 10px;
  }
</style>
