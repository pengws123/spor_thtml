<template>
<div align="center">
  <h1>商品信息</h1>
  <div id="searchDiv">
    <el-form :inline="true" :model="param" class="demo-form-inline">

      <el-form-item label="名称">
        <el-input v-model="param.name" placeholder="名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryDate()">查询</el-button>
        <el-button type="success" @click="adda()">新增</el-button>
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
        label="名称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="imgpath"
        label="图片">
        <template slot-scope="scope">
          <!-- <img src="192.168.1.43:8080/imgFiless/f86a6cd6-a0e3-47a6-ba03-62a68ff41c99.gif"/>-->
          <img width="50px" :src="scope.row.imgpath"/>
        </template>
      </el-table-column>

      <el-table-column
        prop="bandDesc"
        label="介绍">
      </el-table-column>

      <el-table-column
        prop="ord"
        label="排序">
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

  <!-- 新增  -->
  <el-dialog title="商品信息" :visible.sync="addForm">
    <el-form :model="addData" ref="addData" :rules="rule"  label-width="80px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="addData.name" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="首字母" prop="bandE">
        <el-input v-model="addData.bandE" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/api/name/updateFile"
          :on-success="imgCallBack"
          name="file"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </el-form-item>

      <el-form-item label="排序字段" prop="ord">
        <el-input-number v-model="addData.ord"  :step="1" :min="0" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="品牌介绍" prop="bandDesc">
        <el-input type="textarea" v-model="addData.bandDesc"></el-input>
      </el-form-item>



    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addForm = false">取 消</el-button>
      <el-button type="primary" @click="saveForm">确 定</el-button>
    </div>

  </el-dialog>

  <!-- 修改  -->
  <el-dialog title="商品信息" :visible.sync="upForm">
    <el-form :model="upDate" ref="upDate" :rules="rule"  label-width="80px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="upDate.name" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="首字母" prop="bandE">
        <el-input v-model="upDate.bandE" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="图片">
        <img  width="50px" :src="'http://'+upDate.imgpath"/>
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/api/name/updateFile"
          :on-success="imgCallBack"
          name="file"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </el-form-item>

      <el-form-item label="排序字段" prop="ord">
        <el-input-number v-model="upDate.ord"  :step="1" :min="0" :max="1000"></el-input-number>
      </el-form-item>

      <el-form-item label="品牌介绍" prop="bandDesc">
        <el-input type="textarea" v-model="upDate.bandDesc"></el-input>
      </el-form-item>



    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="upForm = false">取 消</el-button>
      <el-button type="primary" @click="updateForm">确 定</el-button>
    </div>

  </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "spname",
        data(){
          return{
            param:{
              name:"",
              //分页数据
              sizes:[2,3,5],
              size:2,
              start:1
            },
            //查询出来的数据
            quydate:[],
            //总条数
            count:0,
            //新增弹框
            addForm:false,
            //修改弹框
            upForm:false,
            //新增的对象
            addData:{
              name:"",
              imgpath:""
            },
            //修改的对象
            upDate:{
              name:""
            },
            rule:{ //验证规则
              carname:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
              ]
            }
          }
        },
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
        //图片
        imgCallBack:function(response, file, fileList){

          this.addData.imgpath=response.data;
          this.upDate.imgpath=response.data;
        },
        queryDate:function () {
          var par=this.$qs.stringify(this.param);
          var url="http://localhost:8080/api/name/queryspname?"+par;
          this.$ajax.get(url).then(rs=>{
            this.quydate=rs.data.data.list;
            this.count=rs.data.data.count;
          }).catch(er=>console.log(er))
        },
        //新增的弹框
        adda:function(){
          this.addForm=true;
          this.addData={
            imgpath:"",
          };
        },
        //新增的方法
        saveForm:function () {
          this.$refs['addData'].validate(res=>{
            if(res==true){
              console.log(this.addData)
              this.$ajax.post("http://localhost:8080/api/name/savespname",this.$qs.stringify(this.addData)).then(rs=>{
                this.addForm=false;
                location.reload();
              }).catch(er=>console.log(er));
            }
          });
        },
        //修改的弹框
        showupdate:function (index,row) {
          this.upForm=true;
          var url="http://localhost:8080/api/name/selectspname?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.upDate=rs.data.data;
          }).catch(er=>console.log(er))
        },
        //修改提交
        updateForm:function () {
          this.$ajax.post("http://localhost:8080/api/name/updatespname",this.$qs.stringify(this.upDate)).then(rs=>{
            this.upForm=false;
            location.reload();
          }).catch(er=>console.log(er));
        },
        //删除
        dele:function (index,row) {
          var url="http://localhost:8080/api/name/delspname?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            location.reload();
          }).catch(er=>console.log(er))
        }
      }
    }
</script>

<style scoped>

</style>
