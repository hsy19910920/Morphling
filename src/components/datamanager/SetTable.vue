<template>
  <el-dialog
    @opened="opens"
    title="自定义列"
    :visible.sync="dialogVisible"
    width="300px"
  >
    <div class="tb_head_list" id="items">
      <div class="item" v-for="(item, index) in setTable" :key="index">
        <el-checkbox v-model="item.value">{{item.label}}</el-checkbox>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setTableHead">确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: '',
  data () {
    return {
      dialogVisible:false,
      setTable:[],
    }
  },
  created(){
    this.$bus.on('openSetTable',(value)=>{
      this.setTable = value.setTable
      this.dialogVisible = value.dialogVsb
    });
  },
  methods:{
    // 打开抽屉层初始化表格
    opens(){
      this.$nextTick(() => {
        this.test();
      }) 
    },


    // 拖拽
    test() {
      var that = this
      var el = document.getElementById('items')
      // 常用
      new Sortable(el, {
        onEnd: function (evt) {
         // 获取排序之后的data数据
          that.setTable.splice(evt.newIndex, 0, that.setTable.splice(evt.oldIndex, 1)[0])
          var newArray = that.setTable.slice(0)
          that.setTable = []
          that.$nextTick(function () {
            that.setTable = newArray
          })
        }
      })
    },

    // 设置表格
    async setTableHead(){
      const{data:res} = await this.$http.post('ad/column',{'column':this.setTable})
      const result = res
      if(result.code !== 200){
        this.$message.error(result.msg);
        return
      }else{
        this.$parent.setTable = this.setTable
        this.$parent.getDataList();
        this.dialogVisible = false;
      }
    },
  },
  mounted () {
    
  },
  beforeDestroy () {
    this.$bus.off('openSetTable');
  },
  components:{
    
  }
}
</script>


<style scoped>
.tb_head_list{
  max-height: 400px;
  overflow-y: auto;
}
.item{
  line-height: 30px;
  padding:0 15px;
  border-radius: 5px;
  color: #409eff;
  background-color: #ecf5ff;
  margin-bottom: 20px;
  font-size: 12px;
}
</style>
