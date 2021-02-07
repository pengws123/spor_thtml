<template>
  <div>
    <el-button type="success" class="el-icon-plus" @click="adda()">新增</el-button>
    <!-- 查询  -->
    <div>
      <el-table
        :data="quydate"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
          width="100">
        </el-table-column>

        <el-table-column
          prop="name"
          width="100"
          label="名字"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button size="mini" class="el-icon-edit" @click="showupdate(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" class="el-icon-delete-solid"  @click="dele(scope.$index,scope.row)">删除</el-button>
            <el-button size="mini" class="el-icon-setting" v-if="scope.row.type!=3" @click="xigsu(scope.row)">维护属性值</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="param.sizes"
        :page-size="param.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>


  </div>
</template>

<script>
    export default {
        name: "userjuese",
      data(){
          return{
            param:{
              //分页数据
              sizes:[5,10,15],
              size:5,
              start:1
            },
            //总条数
            count:0,
            //查询出来的数据
            quydate:[],
          }
      },methods:{
        //第几页
        handleCurrentChange: function (page) { //页数
          this.param.start = page;
          this.queryDate();
          //每页条数
        }, handleSizeChange: function (size) { //条数
          this.param.size = size;
          this.queryDate();
        },
        //查询的方法
        queryDate: function () {
          var par = this.$qs.stringify(this.param);
          var url = "http://localhost:8080/api/userjuese/queryjuese?" + par;
          this.$ajax.get(url).then(rs => {
            this.quydate = rs.data.data.list;
            this.count = rs.data.data.count;
          }).catch(er => console.log(er))
        },
      },
      //初始化函数
      created:function () {
        this.queryDate();
      },
    }
</script>

<style scoped>

</style>
