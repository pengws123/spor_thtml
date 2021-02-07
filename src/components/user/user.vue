<template>
  <div>
    <!-- 查询  -->
    <div>
      <el-table
        :data="quydate"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
         >
        </el-table-column>

        <el-table-column
          prop="name"
          label="名字"
        >
        </el-table-column>

        <el-table-column
          prop="realName"
          label="账号"
        >
        </el-table-column>

        <el-table-column
          prop="sex"
          :formatter="SEX"
          label="性别"
        >
        </el-table-column>

        <el-table-column
          prop="phone"
          label="手机号"
        >
        </el-table-column>

        <el-table-column
          prop="birthday"
          label="生日"
        >
        </el-table-column>

        <el-table-column
          prop="imgUrl"
          label="头像"
        >
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgUrl"/>
          </template>
        </el-table-column>

        <el-table-column
          prop="eduId"
          :formatter="xueli"
          label="学历"
        >
        </el-table-column>


        <el-table-column
          prop="deprId"
          :formatter="bumen"
          label="部门"
        >
        </el-table-column>


        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button size="mini" class="el-icon-edit" @click="showupdate(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" class="el-icon-delete-solid"  @click="dele(scope.$index,scope.row)">删除</el-button>
            <el-button size="mini" class="el-icon-setting" v-if="scope.row.type!=3" @click="xigsu(scope.row)">维护权限</el-button>
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
        name: "user",
      data(){
        return{
          param:{
            //分页数据
            sizes:[2,5,7],
            size:2,
            start:1
          },
          //总条数
          count:0,
          //查询出来的数据
          quydate:[],
        }
      },
      methods:{
        //第几页
        handleCurrentChange: function (page) { //页数
          this.param.start = page;
          this.queryDate();
          //每页条数
        }, handleSizeChange: function (size) { //条数
          this.param.size = size;
          this.queryDate();
        },//查询的方法
        queryDate: function () {
          var par = this.$qs.stringify(this.param);
          var url = "http://localhost:8080/api/user/queryuser?" + par;
          this.$ajax.get(url).then(rs => {
            this.quydate = rs.data.data.list;
            this.count = rs.data.data.count;
          }).catch(er => console.log(er))
        },
        //处理性别
        SEX(row,column,value,index){
          return value==1?"男":"女"
        },
        //处理学历
        xueli(row,column,value,index){
          if(value==1){
            return "高中"
          }
          if(value==2){
            return "大专"
          }
          if(value==3){
            return "本科"
          }
        },
        //处理部门
        bumen(row,column,value,index){
          if(value==1){
            return "人事"
          }
          if(value==2){
            return "全粘"
          }
          if(value==3){
            return "完全粘"
          }
        }
      },//初始化函数
      created:function () {
        this.queryDate();
      }
    }
</script>

<style scoped>

</style>
