<template>
  <div>
    <AddTaobao/>
    <EditTaobao/>
    <div class="sx_box" style="text-align:right; padding-bottom:15px">
      <el-button type="primary" icon="el-icon-refresh-right" size="mini" @click="reloadFun">刷新</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="openAddTaobao">添加</el-button>
      <el-button type="primary" icon="el-icon-delete" size="mini" @click="deletAll" v-if="userinfo.authorize=='3'">批量删除</el-button >
    </div>

    <el-table
      class="com_table"
      :data="tableData"
      border
      max-height="700"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        resizable
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="jc_tbk_config_name"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="session"
        label="session"
      >
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="jc_tbk_config_time"
        label="更新时间"
      >
      </el-table-column>
      <el-table-column resizable show-overflow-tooltip label="状态" v-if="userinfo.authorize=='3'">
        <template slot-scope="scope">
          <el-switch
            @change="setDataStatus(scope.row)"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column resizable show-overflow-tooltip label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditTaobao(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleBrand(scope.row)" v-if="userinfo.authorize=='3'">删除</el-button>
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
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import AddTaobao from './addTaobao'
import EditTaobao from './EditTaobao'
export default {
  name: "",
  inject: ["reload"],
  data() {
    return {
      userinfo:'',
      allCheck:[],
      // 请求参数
      queryInfo: {
        page: 1,
        limit: 13,
      },
      // 总页数
      total: 0,
      setpage:1,
      tableData: [],
    };
  },
  created() {
    const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    this.userinfo = userinfo
    this.getDataList(1);
  },
  methods: {
    // 刷新页面
    reloadFun() {
      this.reload();
    },

    // 打开添加淘宝配置
    openAddTaobao() {
      const dialogVsb = true;
      this.$bus.emit("openAddTaobao", dialogVsb);
    },

    // 打开编辑淘宝配置
    openEditTaobao(row) {
      const editStr = {};
      editStr.row = row;
      editStr.dialogVsb = true;
      this.$bus.emit("openEditTaobao", editStr);
    },

    // 获取数据列表
    async getDataList(page) {
      this.queryInfo.page = page
      const { data: res } = await this.$http.post(
        "config/configPage",
        this.queryInfo
      );
      const result = res
      if (result.code !== 200) {
        this.$message.error(result.msg);
        return
      } else {
        for (let index = 0; index < result.data.list.length; index++) {
          if (result.data.list[index].status == "1") {
            result.data.list[index].status = true;
          } else {
            result.data.list[index].status = false;
          }
        }
        this.tableData = result.data.list;
        this.total = result.data.count;
      }
    },

    // 删除数据
    deleBrand(row){
      var id = row.jc_tbk_config_id
      this.$confirm('是否要删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const{data:res} = await this.$http.post('config/configRemove',{'id':id})
        if(res.code !== 200) return this.$message.error(result.msg);
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
        ids.push(element.jc_tbk_config_id)
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
        const{data:res} = await this.$http.post('config/configRemove',{'id':id})
        if(res.code !== 200) return this.$message.error(result.msg);
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

    // 打开关闭状态
    async setDataStatus(row) {
      const { data: res } = await this.$http.post("config/configStatus", {
        id: row.jc_tbk_config_id,
        status: row.status,
      });
      const result = res
      if (result.code !== 200) {
        this.$message.error(result.msg);
        return
      } else {
        this.$message({
          message: "修改状态成功！",
          type: "success",
        });
      }
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
  components: {
    AddTaobao,
    EditTaobao
  },
};
</script>


<style scoped>
</style>
