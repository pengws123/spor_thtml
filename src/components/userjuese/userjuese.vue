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

    <!--新增角色模板-->
    <div>
      <el-dialog title="新增角色模板" :visible.sync="addsxForm">
        <el-form :model="addsxdate" ref="addsxdate"  label-width="80px">

          <el-form-item label="角色名" prop="name">
            <el-col :span="11">
              <el-input v-model="addsxdate.name" autocomplete="off" label-width="100px"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item >
            <el-button type="primary" class="el-icon-check" @click="savesxForm">确 定</el-button>
            <el-button class="el-icon-close" @click="addsxForm = false">取 消</el-button>
          </el-form-item>

        </el-form>

      </el-dialog>
    </div>

    <!--修改角色模板-->
    <div>
      <el-dialog title="修改角色模板" :visible.sync="upForm">
        <el-form :model="upDate" ref="upDate"  label-width="80px">

          <el-form-item label="角色名" prop="name">
            <el-col :span="11">
              <el-input v-model="upDate.name" autocomplete="off" label-width="100px"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item >
            <el-button type="primary" class="el-icon-check" @click="updateForm">确 定</el-button>
            <el-button class="el-icon-close" @click="upForm = false">取 消</el-button>
          </el-form-item>

        </el-form>

      </el-dialog>
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
            //新增角色弹框值
            addsxForm:false,
            //修改角色弹框属性
            upForm:false,
            //新增属性值弹框
            addsxdate:{},
            //修改角色的对象
            upDate:{},
          }
      },methods:{
        //删除属性值的方法
        dele:function(index,row){
          var url="http://localhost:8080/api/userjuese/deletejuese?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.queryDate();
          }).catch(er=>console.log(er))
        },
        //修改角色的弹框
        showupdate:function(index,row){
          this.upForm=true;
          var url="http://localhost:8080/api/userjuese/selectjuese?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.upDate=rs.data.data;
          }).catch(er=>console.log(er))
        },
        //修改角色提交
        updateForm:function(){
          this.$ajax.post("http://localhost:8080/api/userjuese/updatejuese",this.$qs.stringify(this.upDate)).then(rs=>{
            this.upForm=false;
            location.reload();
          }).catch(er=>console.log(er))
        },
        //新增属角色提交
        savesxForm:function(){
          this.$ajax.post("http://localhost:8080/api/userjuese/savejuese",this.$qs.stringify(this.addsxdate)).then(rs=>{
            this.addsxForm=false;
            location.reload();
          }).catch(er=>console.log(er));
        },
        //新增属性值的弹框
        adda:function(){
          this.addsxForm=true;
          this.addsxdate={};
        },
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
