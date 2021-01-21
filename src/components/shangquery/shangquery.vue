<template>
<div align="center">
  <el-button type="success" @click="adda()">新增</el-button>
  <el-table :data="queryData" style="width: 100%"  border >

    <el-table-column label="名字" prop="name"  align="center">
    </el-table-column>

    <el-table-column label="标题" prop="title"  align="center">
    </el-table-column>

    <el-table-column label="品牌" prop="bandId"  :formatter="formaBand" align="center">
    </el-table-column>

    <el-table-column align="center"
                     prop="imgPath"
                     label="图片">
      <template slot-scope="scope">
        <img width="50px" :src="scope.row.imgPath"/>
      </template>
    </el-table-column>

    <el-table-column label="商品介绍" prop="productdecs"  align="center">
    </el-table-column>

    <el-table-column label="价格" prop="price"  align="center">
    </el-table-column>

    <el-table-column label="库存" prop="stocks"  align="center">
    </el-table-column>

    <el-table-column label="属性类型" prop="perporId"  align="center">
      <el-button mini  @click="xiugai(scope.row.id)">点击查看</el-button>
    </el-table-column>


    <el-table-column label="排序字段" prop="sortNum"  align="center">
    </el-table-column>

    <el-table-column
      align="center">
      <!--  <template slot="header" slot-scope="scope">
         <el-input
           v-model="search"
           size="mini"
           placeholder="输入关键字搜索"/>
       </template>-->
      <template slot-scope="scope">
        <el-button
          type="info" plain
          @click="showupdate(scope.row.id)">编辑</el-button>
        <el-button
          type="danger" plain
          @click="dele(scope.row.id)">删除</el-button>
      </template>


    </el-table-column>-->
  </el-table>
  <el-pagination
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :page-sizes="param.sizes"
    :page-size="param.size"
    layout="total, sizes, prev, pager, next, jumper"
    :total="count">
  </el-pagination>

  <!-- 修改  -->
  <div>
    <el-dialog title="商品信息" :visible.sync="upForm">
      <el-form :model="upDate"  ref="upDate"  label-width="80px">

        <el-form-item label="名字" prop="name">
          <el-col :span="11">
            <el-input v-model="upDate.name" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-col :span="11">
            <el-input v-model="upDate.title" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="品牌" prop="bandId">
          <el-col :span="11">
          <el-select v-model="upDate.bandId" placeholder="请选择">
            <el-option
              v-for="item in BrandData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="图片">
          <el-col :span="11">
            <img  width="50px" :src="upDate.imgPath"/>
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/name/updateFile"
            :on-success="imgCallBack"
            name="file"
            list-type="picture">

            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>

          </el-upload>
          </el-col>
        </el-form-item>

        <el-form-item label="商品介绍" prop="productdecs">
          <el-col :span="11">
          <el-input type="textarea" style="width: 200px"  v-model="upDate.productdecs"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-col :span="11">
            <el-input v-model="upDate.price" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="库存" prop="stocks">
          <el-col :span="11">
            <el-input v-model="upDate.stocks" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="排序" prop="sortNum">
          <el-col :span="11">
            <el-input v-model="upDate.sortNum" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
          <el-button @click="quxiao" class="el-icon-close">取 消</el-button>
          <el-button type="primary" class="el-icon-check" @click="updateForm">确 定</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>

</div>
</template>

<script>
    export default {
        name: "shangquery",
      data(){
          return{
            //查询出来的数据
            queryData:[],
            //修改弹框的属性值
            upForm:false,
            //商品名字的对象
            BrandData:{},
            //总条数
            count:0,
            //用于条件查询
            param:{
              name:"",
              //分页数据
              sizes:[2,3,5],
              size:2,
              start:1
            },
            //修改的对象
            upDate:{}
          }
      },
      created:function () {
          //查询添加的商品
        this.queryShuxing();
        //查询商品属性
        this.queryDate();
      },
      methods:{
        //第几页
        handleCurrentChange:function(page){ //页数
          this.param.start=page;
          this.queryShuxing();
          //每页条数
        },handleSizeChange:function(size){ //条数
          this.param.size=size;
          this.queryShuxing();
        },
        //修改的弹框
        showupdate:function(row){
          this.upForm=true;
          var url="http://localhost:8080/api/pin/selectshangpin?id="+row;
          this.$ajax.post(url).then(rs=>{
            this.upDate=rs.data.data;
          }).catch(er=>console.log(er))
        },
        //修改提交
        updateForm:function(){
          this.$ajax.post("http://localhost:8080/api/pin/updateshangpin",this.$qs.stringify(this.upDate)).then(rs=>{
            this.upForm=false;
          this.queryShuxing();
          }).catch(er=>console.log(er));
        },
        //新增
        adda:function(){
          this.$router.push("/Shangpin");
        },
        //删除的方法
        dele:function(row){
          this.$ajax.get("http://localhost:8080/api/pin/delshangpin?id="+row).then(rs=>{
            this.queryShuxing();
          }).catch(er=>console.log(er));
        },
        //图片
        imgCallBack:function(response, file, fileList){
          this.upDate.imgPath=response.data;
        },
        //取消的弹框的方法
        quxiao:function(){
          this.upForm=false;
        },
        //查询的方法
        queryShuxing:function () {
          var par=this.$qs.stringify(this.param);
          var url="http://localhost:8080/api/pin/queryShang?"+par;
          this.$ajax.get(url).then(rs=>{
            this.queryData=rs.data.data.list;
            console.log(this.queryData);
            this.count=rs.data.data.count;
          }).catch(er=>console.log(er))
        },
        //查询  商品的内容
        queryDate:function () {
          let param={start:1,size:100000000};
          var par=this.$qs.stringify(param);
          var url="http://localhost:8080/api/name/queryspname?"+par;
          this.$ajax.get(url).then(rs=>{
            this.BrandData=rs.data.data.list;
          }).catch(er=>console.log(er))
      },
        //出来品牌名字
        formaBand(row,column,value,index) {
          for (let i = 0; i <this.BrandData.length; i++) {
            if(value==this.BrandData[i].id)
            {return this.BrandData[i].name
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
