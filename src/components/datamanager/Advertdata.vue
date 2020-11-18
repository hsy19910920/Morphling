<template>
  <div>
    <AdvertDrawer/>
    <WarnSet/>
    <SetTable/>
    <div class="sx_box">
      <el-form>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-form-item>
            <el-input placeholder="请输入内容" @clear='getDataList(1)' @keyup.enter.native="searchGetDataList" clearable v-model="queryInfo.query" class="input-with-select" style="width:300px" size="mini">
              <el-select v-model="queryInfo.select" slot="prepend" placeholder="搜索条件" style="min-width:100px" size="mini">
                <el-option label="计划名称" value="ad_name"></el-option>
                <el-option label="广告主id" value="advertiser_id"></el-option>
                <el-option label="广告账号名称" value="username"></el-option>
                <el-option label="代理商账号" value="agen_name" v-if="userinfo.authorize!='2'"></el-option>
                <el-option label="计划id" value="ad_id"></el-option>
                <el-option label="转化类型" value="external_action"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" size="mini" @click="searchGetDataList"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker 
              :picker-options="pickerOptions"
              @change="getDataList(1)"
              size="mini"
              style="min-width:250px"
              v-model="queryInfo.day"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <el-row type="flex" class="row-bg" justify="space-between">
      <div class="tb_icon"><el-button type="primary" icon="el-icon-refresh-right" size="mini" @click="reloadFun">刷新</el-button></div>
      <div class="tb_icon">
        <el-button type="primary" icon="el-icon-s-operation" size="mini" @click="openSetTable">自定义列</el-button>
        <el-button type="primary" icon="el-icon-guide" size="mini" @click="downloadFile()">导出</el-button>
      </div>
    </el-row>

    <div class="dropTabel">
      <el-table
        @sort-change='sortChange'
        class="com_table"
        :data="tableData"
        :sort-orders="['ascending', 'descending']"
        border
        max-height="700"
        style="width: 100%">
        <template v-for="(item,index) in setTable">
          <template v-if="item.label==='是否归档'">
            <el-table-column
              :sortable="item.custom"
              :key="index"
              v-if="setTable[index].value"
              resizable
              show-overflow-tooltip
              :fixed="item.fixed"
              :width="item.width"
              :prop="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" v-if="scope.row.jc_ad_status=='0'">正常</el-link>
                <el-link :underline="false" type="danger" v-else-if="scope.row.jc_ad_status=='1'">错误</el-link>
                <el-link :underline="false" type="danger" v-else></el-link>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.label==='error'">
            <el-table-column
              :sortable="item.custom"
              :key="index"
              v-if="setTable[index].value"
              resizable
              show-overflow-tooltip
              :fixed="item.fixed"
              :width="item.width"
              :prop="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" v-if="scope.row.error=='0'">正常</el-link>
                <el-link :underline="false" type="danger" v-else-if="scope.row.error=='1'">错误</el-link>
                <el-link :underline="false" type="danger" v-else></el-link>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              :sortable="item.custom"
              :key="index"
              v-if="setTable[index].value"
              resizable
              show-overflow-tooltip
              :fixed="item.fixed"
              :width="item.width"
              :prop="item.prop"
              :label="item.label">
            </el-table-column>
          </template>
        </template>
        <el-table-column
          resizable
          show-overflow-tooltip
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openAdvertDrawer(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      class="com_page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[13, 50, 200, 500]"
      :page-size="queryInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog
      title="淘宝店授权过期提醒"
      :visible.sync="visiTaobao"
      width="300px">
      <div class="red over_data" v-for="(item,index) in overdata" :key="index">{{item.jc_tbk_config_name}}授权已经过期</div> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="visiTaobao = false">取 消</el-button>
        <el-button type="primary" @click="visiTaobao = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import AdvertDrawer from './AdvertDrawer'
import WarnSet from './WarnSet'
import SetTable from './SetTable'
export default {
  name: '',
  inject: ["reload"],
  data () {
    return {
      // 时间限制
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      visiTaobao:false,
      userinfo:'',
      // 过去数据
      overdata:[],
      // 请求参数
      queryInfo:{
        query:'',
        page:1,
        limit:13,
        select:'',
        day:[],
      },
      // 总页数
      total:0,
      setpage:1,
      // 自定义列表
      setTable:[
        {value:true, label:'计划name',prop:'ad_name',fixed:'left'},
        {value:true, label:'广告主id',prop:'advertiser_id',fixed:'left'},
        {value:true, label:'广告账号名称',prop:'username',width:'120',fixed:'left'},
        {value:true, label:'代理商账号',prop:'agen_name',width:'120',},
        {value:true, label:'计划id',prop:'ad_id'},
        {value:true, label:'转化类型',prop:'external_action'},
        {value:true, label:'日期',prop:'day'},
        {value:true, label:'消耗',prop:'cost',custom:'custom'},
        {value:true, label:'roi',prop:'roi',custom:'custom'},
        {value:true, label:'昨日roi',prop:'yesterdayROI'},
        {value:true, label:'订单数',prop:'trade_num',custom:'custom',width:'100'},
        {value:true, label:'GMV',prop:'trade_amount',custom:'custom'},
        {value:true, label:'展示数',prop:'show',width:'100',custom:'custom'},
        {value:true, label:'平均千次展现费用',prop:'avg_show_cost',width:'150',custom:'custom'},
        {value:true, label:'点击数',prop:'click',width:'100',custom:'custom'},
        {value:true, label:'平均点击单价',prop:'avg_click_cost',width:'120',custom:'custom'},
        {value:true, label:'点击率',prop:'ctr',width:'100',custom:'custom'},
        {value:true, label:'转化数',prop:'convert',width:'100',custom:'custom'},
        {value:true, label:'转化成本',prop:'convert_cost',width:'100',custom:'custom'},
        {value:true, label:'转化率',prop:'convert_rate',width:'100',custom:'custom'},
        {value:true, label:'完播率',prop:'play_over_rate'},
        {value:true, label:'有效播放率',prop:'valid_play_rate',width:'120'},
        {value:true, label:'广告出价',prop:'cpa_bid'},
        {value:true, label:'广告预算',prop:'budget'},
        {value:true, label:'总消耗',prop:'ad_cost',custom:'custom',width:'100'},
        {value:true, label:'总ROI',prop:'ad_roi',custom:'custom'},
        {value:true, label:'总订单数',prop:'ad_trade_num',custom:'custom',width:'120'},
        {value:true, label:'总GMV',prop:'ad_trade_amount',custom:'custom',width:'100'},
        {value:true, label:'初始计算时间',prop:'jc_ad_start_time',width:'150'},
        {value:true, label:'是否归档',prop:'jc_ad_status'},
        {value:true, label:'error',prop:'error',fixed:'right'},
      ],
      // 表格数据
      tableData: [
        
      ]
    }
  },
  mounted (){
    
  },
  created(){
    const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    this.userinfo = userinfo
    this.getDataHead()
    this.getDataList(1)
  },
  methods:{

    // 刷新页面
    reloadFun() {
      this.reload(); //此处刷新页面
    },

    // 打开广告数据详情
    openAdvertDrawer(row){
      const editStr = {}
      editStr.row = row
      editStr.day = this.queryInfo.day
      editStr.dialogVsb = true
      this.$bus.emit('openAdvertDrawer', editStr);
    },
    

    // 打开自定义列宽
    openSetTable(){
      const setHead = {}
      setHead.dialogVsb = true
      setHead.setTable = JSON.parse(JSON.stringify(this.setTable));
      this.$bus.emit('openSetTable', setHead);
    },

    //导出表格
    downloadFile() {
      require.ensure([], () => {
        const {export_json_to_excel} = require('../../excel/Export2Excel'); 
        const tHeader = ['计划name','广告主id','广告账号名称','计划id','代理商账号','转化类型','日期','消耗','roi','昨日roi','订单数','GMV','展示数','平均千次展现费用','点击数','平均点击单价','点击率','转化数','转化成本','转化率','完播率','有效播放率','广告出价','广告预算','总消耗','总ROI','总订单数','总GMV','初始计算时间','是否归档','error']; 
        const filterVal = ['ad_name','advertiser_id','username','ad_id','agen_name','external_action','day','cost','roi','yesterdayROI','trade_num','trade_amount','show','avg_show_cost','click','avg_click_cost','ctr','convert','convert_cost','convert_rate','play_over_rate','valid_play_rate','cpa_bid','budget','ad_cost','ad_roi','ad_trade_num','ad_trade_amount','jc_ad_start_time','jc_ad_status','error']; 
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '广告数据');
      })
    },
    formatJson(filterVal, jsonData)
    {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    // 获取数据表头
    async getDataHead(){
     const{data:res} = await this.$http.post('ad/column')
     const result = res
     if(result.code !== 200){
       this.$message.error(result.msg);
       return
     }else{
       if(!result.data.column) return
       for (let index = 0; index < result.data.column.length; index++) {
         if(result.data.column[index].value=='1'){
           result.data.column[index].value = true
         }else{
           result.data.column[index].value = false
         }  
       }
      this.setTable = this.assignArr(this.setTable, result.data.column);
     }
    },

    // 数组去重
    assignArr(arr2, arr1) {
      for (var i = 0; i < arr2.length; i++) {
        var flag = false;
        for (var k = 0; k < arr1.length; k++) {
          if (arr2[i].prop === arr1[k].prop) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr1.push(arr2[i])
        }
      }
      return arr1;
    },

    // 获取数据列表
    async getDataList(page){
      this.queryInfo.page = page
      const{data:res} = await this.$http.post('ad/adverData',this.queryInfo)
      const result = res
      if(result.code !== 200){
        this.$message.error(result.msg);
        return
      }else{
        this.tableData = result.data.list
        this.total = result.data.count
        this.overdata = result.data.tbk_last
        if(result.data.tbk_last.length>0 && this.userinfo.authorize=='1'){
          this.visiTaobao = true
        }
      }
    },


    // 搜索验证
    searchGetDataList(){
      if(!this.queryInfo.select){
        this.$message.error('请选择搜索条件！');
        return
      }else{
        this.getDataList(1)
      }
    },


    // 排序
    sortChange(column){
      this.queryInfo.order = ''
      this.queryInfo.field = ''
      if(!column.order){
        this.getDataList(this.setpage)
        return
      }else{
        var order =  column.order.slice(0, -6)
      }
      this.queryInfo.order = order
      this.queryInfo.field = column.prop
      this.getDataList(this.setpage)
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
    AdvertDrawer,
    WarnSet,
    SetTable
  }
}
</script>


<style scoped>
.el-checkbox{
  display: block;
  margin: 5px;
}

.over_data{
  font-size: 12px;
  line-height: 30px;
}
.red{
  color: red;
}

</style>
