<template>
  <div>
    <AddBrand/>
    <EditBrand/>
    <div class="sx_box">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-form size="mini" :inline="true">
          <el-form-item label="时间段">
            <el-date-picker 
              @change="getDataList(1)"
              size="mini"
              v-model="queryInfo.day"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" icon="el-icon-refresh-right" size="mini" @click="reloadFun">刷新</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="openAddBrand">添加</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini" @click="deletAll">批量删除</el-button>
        </div>
      </el-row>
    </div>


    <el-table
      class="com_table"
      :data="tableData"
      border
      max-height="700"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        resizable
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="pid"
        label="pid">
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="nums"
        label="订单数">
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="gmv"
        label="GMV">
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleBrand(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="com_page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[13, 20, 30, 40]"
      :page-size="queryInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import AddBrand from './AddBrand.vue'
import EditBrand from './EditBrand.vue'

export default {
  name: '',
  inject: ["reload"],
  data () {
    return {
      allCheck:[],
      // 请求参数
      queryInfo:{
        day:[],
        page:1,
        limit:13
      },
      // 总页数
      total:0,
      setpage:1,
      tableData: [
        
      ]
    }
  },
  created(){
    this.getDataList(1)
  },
  methods:{

    // 刷新页面
    reloadFun() {
      this.reload()
    },

    // 打开添加品牌数据
    openAddBrand(){
      const dialogVsb = true
      this.$bus.emit('openAddBrand', dialogVsb);
    },

    // 打开编辑品牌数据
    openEditBrand(id){
      const editStr = {}
      editStr.id = id
      editStr.dialogVsb = true
      this.$bus.emit('openEditBrand', editStr);
    },

    // 获取数据列表
    async getDataList(page){
      this.queryInfo.page = page
      const{data:res} = await this.$http.post('ad/brandData',this.queryInfo)
      const result = res
      if(result.code !== 200){
        this.$message.error(result.msg);
        return
      }else{
        this.tableData = result.data.list
        this.total = result.data.count
      }
    },


    // 删除数据
    deleBrand(row){
      var id = row.id
      this.$confirm('是否要删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const{data:res} = await this.$http.post('ad/brandRemove',{'id':id})
        this.getDataList(this.setpage)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },

    // 批量选择
    handleSelectionChange(val){
      var ids = [];
      val.forEach(element =>{
        ids.push(element.id)
      })
      this.allCheck = ids
    },
    // 批量删除
    deletAll(){
      const id = this.allCheck
      if(id.length===0){
        this.$message({
          message: '请选择要删除的数据！',
          type: 'warning'
        });
        return 
      }
      this.$confirm('是否要删除已选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const{data:res} = await this.$http.post('ad/brandRemove',{'id':id})
        this.getDataList(this.setpage)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
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
  components:{
    AddBrand,
    EditBrand
  }
}
</script>


<style scoped>
  
</style>
