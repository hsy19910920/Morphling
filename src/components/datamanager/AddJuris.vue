<template>
    <el-dialog
    title="添加"
    :visible.sync="dialogVisible"
    @close="closeData"
    width="580px">
    <el-row>
      <el-input placeholder="请输入代理商账号" v-model="username" class="input-with-select" @keyup.enter.native="getAgentName">
        <el-button slot="append" icon="el-icon-search" @click="getAgentName"></el-button>
      </el-input>
    </el-row>
    <div class="tab_list">
      <el-tag size="small" v-if="cancel.tagList.id" closable :key="cancel.tagList.id" @close="handleClose">{{cancel.tagList.username}}</el-tag>
    </div>
    <el-row type="flex" class="row-bg" justify="" style="margin-top:15px">
      <el-input placeholder="请输入内容" @clear='clearData' clearable v-model="queryInfo.query" @keyup.enter.native="getDataList(1)" class="input-with-select" style="width:300px" size="mini">
          <el-select v-model="queryInfo.select" slot="prepend" placeholder="搜索条件" style="min-width:100px" size="mini">
            <el-option label="广告主名称" value="name"></el-option>
            <el-option label="广告主id" value="ad_id"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" size="mini" @click="getDataList(1)"></el-button>
        </el-input>
    </el-row>
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
        prop="name"
        label="广告名称">
      </el-table-column>
      <el-table-column
        prop="ad_id"
        label="广告主id">
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      class="com_page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[13, 20, 30, 40]"
      :page-size="queryInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->
    <el-pagination
      class="com_page"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-size="queryInfo.limit"
      small
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
      <el-button type="primary" @click="agentSubmit">确定授权</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      dialogVisible:false,
      // 取消授权参数
      cancel:{
        authorize:[],
        id:'',
        tagList:{}
      },
      username:'',
      // 请求参数
      queryInfo:{
        select:'',
        query:'',
        name:'',
        is_agen:'',
        page:1,
        limit:13,
      },
      // 总页数
      total:0,
      setpage:1,
      tableData:[
        
      ]
    }
  },
  created(){
    this.$bus.on('openAddJuris',(value)=>{
      this.dialogVisible = value
      this.getDataList(1)
    });
  },
  methods:{
    // 获取数据列表
    async getDataList(page){
      this.queryInfo.page = page
      const{data:res} = await this.$http.post('ad/adverAlert',this.queryInfo)
      const result = res
      if(result.code !== 200){
        this.$message.error(result.msg);
        return
      }else{
        this.tableData = result.data.list
        this.total = result.data.count
      }
    },

    // 清楚搜索内容框
    clearData(){
      this.queryInfo.select = ''
      this.queryInfo.query = ''
      this.getDataList(1)
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
          this.handleClose()
          return
        }
        this.cancel.tagList = result.data.agenname
        this.cancel.id = result.data.agenname.id
      }
    },

    // 删除代理商
    handleClose(){
      this.cancel.tagList = {}
      this.cancel.id = ''
    },

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
      if(!this.cancel.id){
        this.$message.error('请搜索需要授权的代理商！');
      }else if(this.cancel.authorize.length==0){
        this.$message.error('请选择需要授权的广告组！');
      }else{
        const{data:res} = await this.$http.post('ad/adverSubmit',this.cancel)
        const result = res
        if(result.code !== 200){
          this.$message.error(result.msg);
          return
        }else{
          this.$message({
            message: '授权成功！',
            type: 'success'
          });
          this.$parent.getDataList(this.$parent.setpage);
          this.dialogVisible = false
        }
      }
    },

    // 关闭清空数据
    closeData(){
      this.username = ''
      this.cancel.id = ''
      this.cancel.tagList = {}
    },

    // 每页显示多少条数据
    handleSizeChange(val) {
      this.queryInfo.limit = val
      this.getDataList(this.setpage)
    },
    // 当前页切换
    handleCurrentChange(val) {
      this.setpage = val
      this.getDataList(val)
    }
  },
  beforeDestroy () {
    this.$bus.off('openAddJuris');
  },
  components:{
    
  }
}
</script>


<style scoped>
  .tab_list{
    margin-top: 10px;
  }
</style>
