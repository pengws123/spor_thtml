<template>
<div>
  <h1>属性展示</h1>
  <div id="searchDiv" align="center">

    <el-form :inline="true" :model="param" class="demo-form-inline">

      <el-form-item label="名称">
        <el-input v-model="param.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDate()">查询</el-button>
        <el-button type="success" @click="addForm=true">新增</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 查询  -->
  <div id="carTable">

    <el-table
      :data="quydate"
      style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="属性英文名称"
          width="180">
        </el-table-column>

        <el-table-column
          prop="nameCH"
          label="属性中文名字"
        >
        </el-table-column>

        <el-table-column
          prop="typeId"
          label="类型"
          :formatter="formaTypeId">
        </el-table-column>

        <el-table-column
          prop="isSKU"
          label="SKU"
          :formatter="SKU"
        >
        </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="showupdate(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="dele(scope.$index,scope.row)">删除</el-button>
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
        name: "SpShu",
      data(){
          return{
            param:{
              name:"",
              //分页数据
              sizes:[2,3,5],
              size:2,
              start:1
            },
            //总条数
            count:0,
            //新增弹框
            addForm:false,
            //查询出来的数据
            quydate:[],
        }
      } ,
      //初始化函数
      created:function () {
        this.queryDate();
      },
      methods:{
        //第几页
        handleCurrentChange:function(page){ //页数
          this.param.start=page;
          this.queryDate();
          //每页条数
        },handleSizeChange:function(size){ //条数
          this.param.size=size;
          this.queryDate();
        },
          //查询的方法
        queryDate:function () {
          var par=this.$qs.stringify(this.param);
          var url="http://localhost:8080/api/perpor/queryspoper?"+par;
          this.$ajax.get(url).then(rs=>{
            this.quydate=rs.data.data.list;
            this.count=rs.data.data.count;
          }).catch(er=>console.log(er))
        }
      }
    }
</script>

<style scoped>

</style>
