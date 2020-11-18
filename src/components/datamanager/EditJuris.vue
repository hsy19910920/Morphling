<template>
    <el-dialog
    title="已授权代理商"
    :visible.sync="dialogVisible"
    @click="clearData"
    width="30%">
    <el-table
      @selection-change="handleSelectionChange"
      class="com_table"
      :data="tableData"
      max-height="500px"
      border
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="username"
        label="代理商">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="agentSubmit">取消授权</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      dialogVisible:false,
      loading:false,
      addBrandForm:{
        name:'',
      },
      tableData:[
        
      ],
      // 提交授权参数
      cancel:{
        authorize:[],
        id:'',
      },
    }
  },
  created(){
    this.$bus.on('openEditJuris',(value)=>{
      this.dialogVisible = value.dialogVsb
      this.tableData = JSON.parse(JSON.stringify(value.row.agenname));
      this.cancel.id = value.row.id
    });
    
  },
  methods:{
    // 批量选择
    handleSelectionChange(val){
      var ids = [];
      val.forEach(element =>{
        ids.push(element.id)
      })
      this.cancel.authorize = ids
    },

    // 取消授权提交
    async agentSubmit(){
      if(this.cancel.authorize.length==0){
        this.$message.error('请选择要取消授权的广告组！');
      }else{
        const{data:res} = await this.$http.post('ad/adverCancel',this.cancel)
        const result = res
        if(result.code !== 200){
          this.$message.error(result.msg);
          return
        }else{
          this.$message({
            message: '取消授权成功！',
            type: 'success'
          });
          this.$parent.getDataList(this.$parent.setpage);
          this.dialogVisible = false
        }
      }
    },

    // 关闭清空数据
    clearData(){
      this.cancel.authorize = []
    },

  },
  beforeDestroy () {
    this.$bus.off('openEditJuris');
  },
  components:{
    
  }
}
</script>


<style scoped>
  
</style>
