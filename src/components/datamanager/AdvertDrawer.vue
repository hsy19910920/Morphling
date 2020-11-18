<template>
  <el-drawer
    title="我是标题"
    size="933px"
    :visible.sync="drawerVsb"
    @close="closeFun"
    :with-header="false">
    <div class="flexbox gd_box" v-loading="loading">
      <!-- 左侧导航 -->
      <div class="gd_nav">
        <div class="close_btn" @click="drawerVsb = false">
          <el-button type="info" icon="el-icon-close" circle></el-button>
          <!-- <i class="el-icon-close"></i> -->
        </div>
        <div class="nav_btn flexbox" @click="show = '1'" :class="show=='1'?'active':''">
          <i class="el-icon-help"></i>
          <span>详情</span>
        </div>
        <div class="nav_btn flexbox" @click="show = '2'" :class="show=='2'?'active':''">
          <i class="el-icon-s-data"></i>
          <span>数据</span>
        </div>
        <template v-if="queryInfo.egg==='show'">
          <div class="nav_btn flexbox" @click="show = '3'" :class="show=='3'?'active':''">
            <i class="el-icon-tickets"></i>
            <span>信息</span>
          </div>
          <div class="nav_btn flexbox" @click="show = '4'" :class="show=='4'?'active':''">
            <i class="el-icon-video-camera"></i>
            <span>视频</span>
          </div>
        </template>
      </div>
      <!-- 左侧导航 -->

      <!-- 右侧数据 -->
      <div class="gd_content flexbox">
        <div class="gd_head flexbox">
          <span>{{title}}</span>
          <!-- <el-button type="primary" size="mini">预警设置</el-button> -->
        </div>
        <div class="gd_search">
          <el-date-picker
              :picker-options="pickerOptions"
              @change="getDataList"
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
        </div>
        <div class="gd_mid" v-show="show=='1'">
          <div class="scroll_box">
            <el-row class="row-bg" :gutter="30">
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>ROI</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.roi}}</div>
                  <div class="d_text">总ROI {{dataList.ad_roi}} </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>广告消耗</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.cost}}元</div>
                  <div class="d_text">总消耗 {{dataList.ad_cost}} 元</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>点击数</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.click}}次</div>
                  <div class="d_text">平均点击单价 {{dataList.avg_click_cost}} 元</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>展示数</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.show}}次</div>
                  <div class="d_text">平均千次展示成本 {{dataList.avg_show_cost}} 元</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>GMV</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.trade_amount}}元</div>
                  <div class="d_text">总GMV {{dataList.ad_trade_amount}} 元</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>订单数</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.trade_num}}单</div>
                  <div class="d_text">总订单数 {{dataList.ad_trade_num}} 单</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>客单价</span> <el-tag size="mini" effect="dark">日</el-tag></div>
                  <div class="d_money">{{dataList.kdj}}元</div>
                  <div class="d_text">总客单价 {{dataList.zkdj}} 元</div>
                </div>
              </el-col>
              <!-- <el-col :span="8">
                <div class="data_box">
                  <div class="d_title flexbox flexbetween flexcenter"><span>预警未开启</span></div>
                  <div class="data_tabel">
                    <el-table
                      class="com_table"
                      border
                      :data="tableData">
                      <el-table-column
                        prop="date"
                        label="持续天数">
                      </el-table-column>
                      <el-table-column
                        prop="roi"
                        label="预警ROI">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col> -->
            </el-row>
          </div>
        </div>
        <div class="gd_mid" v-show="show=='2'">
          <div class="scroll_box">
            <div class="echarts_box">
              <div id="roi_echarts" style="width: 850px;height:400px;"></div>
            </div>
            <div class="echarts_box">
              <div id="xh_echarts" style="width: 850px;height:400px;"></div>
            </div>
            <div class="echarts_box">
              <div id="gmv_echarts" style="width: 850px;height:400px;"></div>
            </div>
          </div>
        </div>
        <template v-if="queryInfo.egg==='show'">
          <div class="gd_mid" v-show="show=='3'">
            <div class="scroll_box">
              <el-card class="box-card" v-if="audience">
                <h5 class="gd_title" style="margin-top:0">基础数据</h5>
                <el-divider><span class="gd_line">受众网络类型，手机信息</span></el-divider>
                <el-row class="gd_row">
                  <el-col :span="12">
                    <span class="gd_name">受众网络类型：</span>
                    <span class="gd_text">
                      <template v-for="item in audience.ac">{{item}}，</template>
                    </span>
                  </el-col>
                  <el-col :span="12">
                    <span class="gd_name">手机价格区间：</span>
                    <span class="gd_text">
                      <template v-for="item in audience.launch_price">{{item}}，</template>
                    </span>
                  </el-col>
                  <el-col :span="24">
                    <span class="gd_name">手机品牌：</span>
                    <span class="gd_text">
                      <template v-for="item in audience.device_brand">{{item}}，</template>
                    </span>
                  </el-col>
                </el-row>
                <el-divider><span class="gd_line">年龄性别</span></el-divider>
                <el-row class="gd_row">
                  <el-col :span="12">
                    <span class="gd_name">受众年龄：</span>
                    <span class="gd_text">
                      <template v-for="item in audience.age">{{item}}，</template>
                    </span>
                  </el-col>
                  <el-col :span="12">
                    <span class="gd_name">受众性别：</span>
                    <span class="gd_text">{{audience.gender}}</span>
                  </el-col>
                </el-row>
                <el-divider><span class="gd_line">城市</span></el-divider>
                <el-row class="gd_row">
                  <el-col :span="24">
                    <span class="gd_text"><template v-for="item in audience.city">{{item}}，</template></span>
                  </el-col>
                </el-row>
                <h5 class="gd_title">人群包</h5>
                <el-divider><span class="gd_line">定向人群包</span></el-divider>
                <div class="gd_row">
                  <span class="gd_text">
                    <template v-for="item in audience.retargeting_tags_include">标签：{{item.tag}}名称：{{item.name}}</template>
                  </span>
                </div>
                <el-divider><span class="gd_line">排除人群包</span></el-divider>
                <div class="gd_row">
                  <span class="gd_text">
                    <template v-for="item in audience.retargeting_tags_exclude">标签：{{item.tag}}名称：{{item.name}}</template>
                  </span>
                </div>
                <h5 class="gd_title">行为关键词</h5>
                <el-row class="gd_row" style="margin-top:10px">
                  <el-col :span="12">
                    <span class="gd_name">行为天数：</span>
                    <template v-if="audience.action">
                      <span class="gd_text">{{audience.action.action_days}}</span>
                    </template>
                  </el-col>
                  <el-col :span="12">
                    <span class="gd_name">行为场景：</span>
                    <template v-if="audience.action">
                      <span class="gd_text"><template  v-for="item in audience.action.action_scene">{{item}}，</template></span>
                    </template>
                  </el-col>
                </el-row>
                <el-row class="gd_row">
                  <el-col :span="24">
                    <template v-if="audience.action">
                      <span class="gd_text"><template v-for="item in audience.action.action_words">{{item.name+item.num}}，</template></span>
                    </template>
                  </el-col>
                </el-row>
                <h5 class="gd_title">兴趣关键词</h5>
                <div class="gd_row">
                  <span class="gd_text">
                    <template v-for="item in audience.interest_words">{{item}}，</template>
                  </span>
                </div>
              </el-card>
            </div>
          </div>
          <div class="gd_mid" v-show="show=='4'">
            <div class="scroll_box">
              <el-card class="box-card"  v-if="audience">
                <div class="vd_box" v-for="(item,index) in audience.materials" :key="index">
                  <h5 class="gd_title" style="margin-top:0">{{item.filename}}</h5>
                  <div class="vd_item">
                    <span class="gd_name">视频链接</span>
                    <div class="vd_list"><el-link style="font-size:12px" type="primary" :href="item.url" target="_blank">链接{{item.filename}}</el-link></div>
                  </div>
                  <div class="vd_item">
                    <span class="gd_name">展现数据</span>
                    <div class="vd_list">
                      <span class="gd_name">转化数:</span>
                      <span class="gd_text">{{item.convert}}</span>
                      <span class="gd_name">转化成本:</span>
                      <span class="gd_text">{{item.convert_cost}}</span>
                      <span class="gd_name">转化率:</span>
                      <span class="gd_text">{{item.convert_rate}}</span>
                      <span class="gd_name">深度转化数:</span>
                      <span class="gd_text">{{item.deep_convert}}</span>
                      <span class="gd_name">深度转化成本:</span>
                      <span class="gd_text">{{item.deep_convert_cost}}</span>
                      <span class="gd_name">深度转化率:</span>
                      <span class="gd_text">{{item.deep_convert_rate}}</span>
                    </div>
                  </div>
                  <div class="vd_item">
                    <span class="gd_name">视频数据</span>
                    <div class="vd_list">
                      <span class="gd_name">播放数:</span>
                      <span class="gd_text">{{item.total_play}}</span>
                      <span class="gd_name">有效播放数:</span>
                      <span class="gd_text">{{item.valid_play}}</span>
                      <span class="gd_name">有效播放成本:</span>
                      <span class="gd_text">{{item.valid_play_cost}}</span>
                      <span class="gd_name">有效播放率:</span>
                      <span class="gd_text">{{item.valid_play_rate}}</span>
                      <span class="gd_name">播放完成数:</span>
                      <span class="gd_text">{{item.play_over}}</span>
                      <span class="gd_name">播完率:</span>
                      <span class="gd_text">{{item.play_over_rate}}</span>
                      <span class="gd_name">2秒播放率:</span>
                      <span class="gd_text">{{item.play_duration_2s_rate}}</span>
                      <span class="gd_name">3秒播放率:</span>
                      <span class="gd_text">{{item.play_duration_3s_rate}}</span>
                      <span class="gd_name">5秒播放率:</span>
                      <span class="gd_text">{{item.play_duration_5s_rate}}</span>
                      <span class="gd_name">10秒播放率:</span>
                      <span class="gd_text">{{item.play_duration_10s_rate}}</span>
                      <span class="gd_name">25%进度播放率:</span>
                      <span class="gd_text">{{item.play_25_feed_break_rate}}</span>
                      <span class="gd_name">50%进度播放率:</span>
                      <span class="gd_text">{{item.play_50_feed_break_rate}}</span>
                      <span class="gd_name">75%进度播放率:</span>
                      <span class="gd_text">{{item.play_75_feed_break_rate}}</span>
                      <span class="gd_name">99%进度播放率:</span>
                      <span class="gd_text">{{item.play_100_feed_break_rate}}</span>
                      <span class="gd_name">平均单次播放时长:</span>
                      <span class="gd_text">{{item.average_play_time_per_play}}</span>
                    </div>
                  </div>
                  <div class="vd_item">
                    <span class="gd_name">互动数据</span>
                    <div class="vd_list">
                      <span class="gd_name">分享数:</span>
                      <span class="gd_text">{{item.share}}</span>
                      <span class="gd_name">评论数:</span>
                      <span class="gd_text">{{item.comment}}</span>
                      <span class="gd_name">点赞数:</span>
                      <span class="gd_text">{{item.like}}</span>
                      <span class="gd_name">不感兴趣数:</span>
                      <span class="gd_text">{{item.dislike}}</span>
                      <span class="gd_name">新增关注数:</span>
                      <span class="gd_text">{{item.follow}}</span>
                      <span class="gd_name">私信数:</span>
                      <span class="gd_text">{{item.message_action}}</span>
                      <span class="gd_name">举报数:</span>
                      <span class="gd_text">{{item.report}}</span>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </template>
      </div>
      <!-- 右侧数据 -->
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      // 时间限制
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      // 请求参数
      queryInfo:{
        day:[],
        ad_id:'',
        egg:''
      },
      showList:false,
      title:'',
      loading:false,
      date:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
      cost:[],
      gmv:[],
      roi:[],
      drawerVsb: false,
      show:'1',
      dataList:{},
      audience:{
        
      }
    }
  },
  created(){
    this.$bus.on('openAdvertDrawer',(value)=>{
      this.drawerVsb = value.dialogVsb
      this.queryInfo.ad_id = value.row.ad_id
      this.queryInfo.day = value.day
      this.title = value.row.ad_name
      this.getDataList(value.row)
    });
  },
  mounted(){
    
  },
  methods:{

    // 获取数据
    async getDataList(row){
      this.loading = true
      const egg = this.$route.query.egg
      if(egg){
        this.queryInfo.egg = egg
      }
      const{data:res} = await this.$http.post('ad/getadinfo',this.queryInfo)
      const result = res
      if(result.code !== 200){
        this.$message.error(result.msg);
        this.drawerVsb = false
        return
      }else{
        this.loading = false
        this.cost = result.data.cost
        this.gmv = result.data.gmv
        this.roi = result.data.roi
        this.audience = result.data.audience
        const a = result.data.addata.trade_amount/result.data.addata.trade_num
        let b = Math.round(a*100)/100;
        if(isNaN(b)){
          b=0          
        }
        const c = result.data.addata.ad_trade_amount/result.data.addata.ad_trade_num
        let d = Math.round(c*100)/100;
        if(isNaN(d)){
          d=0          
        }
        this.dataList = result.data.addata
        this.dataList.kdj = b
        this.dataList.zkdj = d
        this.roiChart();
        this.xhChart();
        this.gmvChart();
      }
    },


    // 关闭抽屉层重置数据操作
    closeFun(){
      this.show = '1',
      this.queryInfo.day = []
    },

    // 打开预警设置
    // openWarnSet(){
    //   const dialogVsb = true
    //   this.$bus.emit('openWarnSet', dialogVsb);
    // },

    // ROI表格初始化
    roiChart(){
		  // 基于准备好的dom，初始化echarts实例
		  var roi_echarts = this.$echarts.init(document.getElementById('roi_echarts'));
		  // 指定图表的配置项和数据
		  var option = {
        color: '#5793f3',
			  title: {
				  
			  },
			  tooltip: {
          // trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
			  legend: {
				  data:['ROI']
			  },
			  xAxis: {
          data:this.date,
          axisTick: {
            alignWithLabel: true
          },
			  },
			  yAxis: {},
			  series: [{
				  name: 'ROI',
				  type: 'line',
				  data: this.roi
			  }]
		  };
		  // 使用刚指定的配置项和数据显示图表。
      roi_echarts.setOption(option);
      window.onresize = function(){
        roi_echarts.resize()
      }
    },
    
    // 消耗表格初始化
    xhChart(){
		  // 基于准备好的dom，初始化echarts实例
		  var xh_echarts = this.$echarts.init(document.getElementById('xh_echarts'));
		  // 指定图表的配置项和数据
		  var option = {
        color: '#5793f3',
			  title: {
				  
			  },
			  tooltip: {
          // trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
			  legend: {
				  data:['消耗']
			  },
			  xAxis: {
          data:this.date,
          axisTick: {
            alignWithLabel: true
          },
			  },
			  yAxis: {},
			  series: [{
				  name: '消耗',
				  type: 'line',
				  data: this.cost
			  }]
		  };
		  // 使用刚指定的配置项和数据显示图表。
      xh_echarts.setOption(option);
      window.onresize = function(){
        xh_echarts.resize()
      }
    },
    
    // GMV表格初始化
    gmvChart(){
		  // 基于准备好的dom，初始化echarts实例
		  var gmv_echarts = this.$echarts.init(document.getElementById('gmv_echarts'));
		  // 指定图表的配置项和数据
		  var option = {
        color: '#5793f3',
			  title: {
				  
			  },
			  tooltip: {
          // trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
			  legend: {
				  data:['GMV']
			  },
			  xAxis: {
          data:this.date,
          axisTick: {
            alignWithLabel: true
          },
			  },
			  yAxis: {},
			  series: [{
				  name: 'GMV',
				  type: 'line',
				  data: this.gmv
			  }]
		  };
		  // 使用刚指定的配置项和数据显示图表。
      gmv_echarts.setOption(option);
      window.onresize = function(){
        gmv_echarts.resize()
      }
		}
  },
  beforeDestroy () {
    this.$bus.off('openAdvertDrawer');
  },
  components:{
    
  }
}
</script>


<style scoped>
  .gd_box{
    height: 100%
  }
  .gd_nav{
    width: 40px;
    border-right: 1px solid #ececec;
  }
  .gd_content{
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-direction: column;
    flex-direction: column;
  }
  .close_btn .el-button{
    height: 40px;
    width: 40px;
    background-color: #2D3E55;
    color: #fff;
    border-radius: 0;
    border: 0;
  }
  .close_btn:hover{
    opacity: .8;
  }
  .nav_btn{
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    height: 50px;
    cursor: pointer;
    border-bottom: 1px solid #ececec;
  }
  .nav_btn i{
    font-size: 18px;
  }
  .nav_btn span{
    font-size: 12px;
    margin-top: 5px;
  }
  .nav_btn.active{
    color: #fff;
    background-color: #2F88FF;
  }
  .gd_head{
    height: 40px;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #ececec;
  }
  .gd_head span{
    -webkit-flex: 1;
    flex: 1;
    font-size: 12px;
    margin-right: 30px;
  }
  .gd_search{
    height: 50px;
    text-align: right;
    line-height: 50px;
    padding: 0 20px;
    box-shadow: 1px 0 6px 0 rgba(0,0,0,0.05);
    position: relative;
    z-index: 2;
  }
  .gd_mid{
    -webkit-flex: 1;
    flex: 1;
    height: 100%;
    background-color: #f9f9f9;
    position: relative;
  }
  .scroll_box{
    box-sizing: border-box;
    padding: 20px;
  }
  .data_box{
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 1px 0 6px 0 rgba(0,0,0,0.05);
    margin-bottom: 30px;
  }
  .d_title{
    height: 40px;
    border-bottom: 1px solid #ececec;
    padding: 0 15px;
  }
  .d_title span{
    font-size: 14px;
  }
  .d_title .el-tag{
    font-size: 12px;
  }
  .d_money{
    font-size: 30px;
    padding:15px;
    height: 30px;
    line-height: 30px;
  }
  .d_text{
    font-size: 13px;
    padding: 0 15px 15px;
    color: #999;
  }
  .data_tabel{
    padding: 10px;
  }
  .data_tabel .com_table{
    margin-top: 0;
  }
  .gd_title{
    font-size: 16px;
    margin-top: 25px;
  }
  .gd_line{
    font-size: 12px;
  }
  .gd_name{
    color: #999;
    font-size: 12px;
  }
  .gd_text{
    color: #2F88FF;
    font-size: 12px;
  }
  .gd_row{
    line-height: 30px;
  }
  .vd_item{
    padding: 10px 0;
    border-bottom: 1px solid #ececec;
  }
  .vd_list{
    margin-top: 10px;
  }
  .vd_list .gd_text{
    margin-right: 10px;
  }
  .vd_box{
    margin-bottom: 15px;
  }
</style>
<style>
  .data_tabel .com_table td, .data_tabel .com_table th{
    padding: 5px 0;
  }
</style>
