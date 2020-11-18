<template>
  <div>
    <AddJuris />
    <EditJuris />
    <div class="sx_box">
      <el-form>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-form-item>
            <el-input
              placeholder="请输入内容"
              @clear="clearData"
              clearable
              v-model="queryInfo.query"
              class="input-with-select"
              style="width: 300px"
              size="mini"
              @keyup.enter.native="getDataList(1)"
            >
              <el-select
                v-model="queryInfo.select"
                slot="prepend"
                placeholder="搜索条件"
                style="min-width: 100px"
                size="mini"
              >
                <el-option label="广告主名称" value="name"></el-option>
                <el-option label="所属品牌公司" value="agen_name"></el-option>
                <el-option label="广告主id" value="ad_id"></el-option>
                <!-- <el-option label="状态" value="status"></el-option> -->
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                size="mini"
                @click="getDataList(1)"
              ></el-button>
            </el-input>
          </el-form-item>
          <div>
            <el-button
              type="primary"
              icon="el-icon-refresh-right"
              size="mini"
              @click="reloadFun"
              >刷新</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="openAddJuris"
              >授权</el-button
            >
          </div>
        </el-row>
      </el-form>
    </div>

    <el-table
      class="com_table"
      :data="tableData"
      border
      max-height="700"
      style="width: 100%"
    >
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="name"
        label="广告主名称"
      >
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="username"
        label="所属品牌公司"
      >
      </el-table-column>
      <el-table-column
        resizable
        show-overflow-tooltip
        prop="ad_id"
        label="广告主id"
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
      <el-table-column resizable show-overflow-tooltip label="已授权代理商">
        <template slot-scope="scope">
          <template v-if="scope.row.is_agen == 1">
          <el-button
            size="mini"
            type="primary"
            @click="openEditJuris(scope.row)"
            
            >查看</el-button
          >
          <span style="margin-left:10px">代理商总数:<el-link type="success" :underline="false">{{scope.row.agencount}}</el-link></span>
          </template>
          <el-button
            size="mini"
            type="primary"
            @click="openEditJuris(scope.row)"
            disabled
            v-else
            >查看</el-button
          >
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
import AddJuris from "./AddJuris";
import EditJuris from "./EditJuris";
export default {
  name: "",
  inject: ["reload"],
  data() {
    return {
      allCheck: [],
      // 请求参数
      queryInfo: {
        select: "",
        query: "",
        name: "",
        is_agen: "",
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
    this.getDataList(1);
    const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    this.userinfo = userinfo
  },
  methods: {
    // 刷新页面
    reloadFun() {
      this.reload();
    },

    // 打开添加授权
    openAddJuris() {
      const dialogVsb = true;
      this.$bus.emit("openAddJuris", dialogVsb);
    },

    // 打开编辑授权
    openEditJuris(row) {
      const editStr = {};
      editStr.row = row;
      editStr.dialogVsb = true;
      this.$bus.emit("openEditJuris", editStr);
    },

    // 获取数据列表
    async getDataList(page) {
      this.queryInfo.page = page
      const { data: res } = await this.$http.post(
        "ad/adverPage",
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



    // 打开关闭状态
    async setDataStatus(row) {
      const { data: res } = await this.$http.post("ad/adverStatus", {
        id: row.id,
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

    // 清楚搜索内容框
    clearData() {
      this.queryInfo.select = "";
      this.queryInfo.query = "";
      this.getDataList(1);
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
    AddJuris,
    EditJuris,
  },
};
</script>


<style scoped>
</style>
