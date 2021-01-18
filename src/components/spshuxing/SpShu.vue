<template>
<div>
  <h1>属性展示</h1>
  <div id="searchDiv" align="center">

    <el-form :inline="true" :model="param" class="demo-form-inline">

      <el-form-item label="名称">
        <el-input v-model="param.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="el-icon-refresh" @click="queryDate()">查询</el-button>
        <el-button type="success" class="el-icon-plus" @click="adda()">新增</el-button>
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
          width="100">
        </el-table-column>

          <el-table-column
            prop="typeId"
            width="100"
            label="类型名称"
            :formatter="formaTypeId">
          </el-table-column>

          <el-table-column
            prop="nameCH"
            width="100"
            label="属性中文名字"
          >
          </el-table-column>

        <el-table-column
          prop="name"
          label="属性英文名称"
          width="100">
        </el-table-column>


        <el-table-column
          prop="isSKU"
          width="100"
          label="SKU"
          :formatter="SKU"
        >
        </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button size="mini" class="el-icon-edit" @click="showupdate(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" class="el-icon-delete-solid"  @click="dele(scope.$index,scope.row)">删除</el-button>
          <el-button size="mini" class="el-icon-setting" v-if="scope.row.type!=3" @click="xigsu(scope.$index,scope.row)">维护属性值</el-button>
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

  <!--新增模板-->
  <div>
    <el-dialog title="属性新增信息" :visible.sync="addForm">
      <el-form :model="addData" :rules="rule" ref="addData"  label-width="80px">
        <el-form-item label="英文名称" prop="name">
          <el-col :span="11">
          <el-input v-model="addData.name" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCH">
          <el-col :span="11">
          <el-input v-model="addData.nameCH" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="属性类型" prop="typeId">
          <el-select v-model="addData.typeId" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addData.type" placeholder="请选择">
            <el-option
              v-for="item in leixngData"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型:" prop="isSKU">
          <el-radio-group v-model="addData.isSKU">
            <el-radio   :label="1">是</el-radio>
            <el-radio   :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item >
        <el-button type="primary" class="el-icon-check" @click="saveForm">确 定</el-button>
        <el-button @click="addForm = false" class="el-icon-close">取 消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
  <!-- 修改  -->
  <div>
    <el-dialog title="商品信息" :visible.sync="upForm">
      <el-form :model="upDate"  ref="upDate" :rules="rule"  label-width="80px">

        <el-form-item label="英文名称" prop="name">
          <el-col :span="11">
          <el-input v-model="upDate.name" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCH">
          <el-col :span="11">
          <el-input v-model="upDate.nameCH" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="属性类型" prop="typeId">
          <el-select v-model="upDate.typeId" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="upDate.type" placeholder="请选择">
            <el-option
              v-for="item in leixngData"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型:" prop="isSKU">
          <el-radio-group v-model="upDate.isSKU">
            <el-radio   :label="1">是</el-radio>
            <el-radio   :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item >
        <el-button @click="upForm = false" class="el-icon-close">取 消</el-button>
        <el-button type="primary" class="el-icon-check" @click="updateForm">确 定</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>



  <!-- 属性查询  -->
  <div>
    <el-dialog :title="this.sxname+'查询信息'" :visible.sync="ShuForm">
        <el-button type="success" class="el-icon-plus" @click="sxadd()">新增</el-button>
      <el-table
        :data="shudate"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
          width="100">
        </el-table-column>

        <el-table-column
          prop="attId"
          label="属性名称"
          width="100"
          :formatter="formaperId">
        </el-table-column>


        <el-table-column
          prop="nameCH"
          width="110"
          label="属性值中文名字"
        >
        </el-table-column>


        <el-table-column
            prop="name"
            width="100"
            label="属性值名称"
           >
          </el-table-column>



        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button size="mini" class="el-icon-edit" @click="showupdatesx(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" class="el-icon-delete-solid" type="danger" @click="delet(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>

  <!--新增属性值模板-->
  <div>
    <el-dialog :title="this.sxname+'新增信息'" :visible.sync="addsxForm">
      <el-form :model="addsxdate" :rules="rule" ref="addsxdate"  label-width="80px">

        <el-form-item label="中文名称" prop="nameCH">
          <el-col :span="11">
          <el-input v-model="addsxdate.nameCH" autocomplete="off" label-width="100px"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="英文名称" prop="name">
          <el-col :span="11">
          <el-input v-model="addsxdate.name" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
        <el-button type="primary" class="el-icon-check" @click="savesxForm">确 定</el-button>
        <el-button class="el-icon-close" @click="addsxForm = false">取 消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>

  <!--修改属性值模板-->
  <div>
    <el-dialog :title="this.sxname+'修改信息'" :visible.sync="upsxForm">
      <el-form :model="upsxdate" :rules="rule" ref="upsxdate" label-width="80px">

        <el-form-item label="中文名称" prop="nameCH">
          <el-col :span="11">
          <el-input v-model="upsxdate.nameCH" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="英文名称" prop="name">
          <el-col :span="11">
          <el-input v-model="upsxdate.name" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
        <el-button type="primary" class="el-icon-check" @click="upsxTable">确 定</el-button>
        <el-button class="el-icon-close" @click="upsxForm = false">取 消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</div>
</template>

<script>
    export default {
        name: "SpShu",
      data(){

        var checkname = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('属性名不能为空'));
          }
          if(/^[\u4e00-\u9fa5]+$/i.test(value)){
            callback();
          }else{
            callback(new Error('只能输入中文'));
          }
        };

          return{
            param:{
              name:"",
              //分页数据
              sizes:[2,3,5],
              size:2,
              start:1
            },
            //属性的查询弹框
            ShuForm:false,
            //修改弹框
            upForm:false,
            sxname:"",
            //修改的对象
            upDate:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            //属性查出来的数据
            shudate:[],
            //总条数
            count:0,
            //新增属性值弹框值
            addsxForm:false,
            //修改属性值弹框值
            upsxForm:false,
            //新增属性值弹框
            addsxdate:{},
            //修改属性值弹框
            upsxdate:{},
            //新增弹框
            addForm:false,
            //查询出来的数据
            quydate:[],
            //获取类型的数据
            typeData:[],
            types:[],
            //递归拼接处理
            typeName:"",
            //查询属性的方法
            pearDate:[],
            //类型下拉
            leixngData:[{type:0,name:"下拉框"},{type:1,name:"单选框"},{type:2,name:"复选框"},{type:3,name:"输入框"}],
            //新增的对象
            addData:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            pid:"",
            rule:{ //验证规则
              nameCH:[
                { required: true, message: '请输入属性值的名称', trigger: 'blur' },
                { max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' },
                { validator:checkname,trigger: 'blur' }
              ],
              name: [
                { required: true, message: '请输入属性值', trigger: 'change' }
              ]
            }
        }
      } ,
      //初始化函数
      created:function () {
        this.queryDate();
        this.queryType();
        this.queryPeor();
      },
      methods: {
          //查询属性值的弹框
        xigsu:function(index,row){
          this.pid=row.id;
          this.sxname=row.nameCH;
          this.ShuForm=true;
          this.$ajax.get("http://localhost:8080/api/sxvalue/querysxvalue?attId="+row.id).then(res => {
            this.shudate = res.data.data;
          }).catch(err => console.log(err));
    },
        //查询属性值得方法
        queryPeor:function(){
          this.$ajax.get("http://localhost:8080/api/perpor/getData").then(res => {
            this.pearDate = res.data.data;
          }).catch(err => console.log(err));
        },
        //新增属性值的弹框
        sxadd:function(){
          this.addsxForm=true;
          this.addsxdate={};
        },
        //新增属性值的提交
        savesxForm:function(){
          this.$refs['addsxdate'].validate(res=>{
            if(res==true){
              this.addsxdate.attId=this.pid;
              this.$ajax.post("http://localhost:8080/api/sxvalue/savexvalue",this.$qs.stringify(this.addsxdate)).then(rs=>{
                this.upForm=false;
                location.reload();
              }).catch(er=>console.log(er));
            }
          });
        },
        //修改属性值的弹框
        showupdatesx:function(index,row){
          this.upsxForm=true;
          var url="http://localhost:8080/api/sxvalue/selectById?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.upsxdate=rs.data.data;
          }).catch(er=>console.log(er))
        },
        //修改属性值的弹框
        upsxTable:function(){
          this.$refs['upsxdate'].validate(res=>{
            if(res==true){
              this.$ajax.post("http://localhost:8080/api/sxvalue/updatexvalue",this.$qs.stringify(this.upsxdate)).then(rs=>{
                this.upForm=false;
                location.reload();
              }).catch(er=>console.log(er))
            }
          })
        },
        //删除属性值的方法
        delet:function(index,row){
          var url="http://localhost:8080/api/sxvalue/delxvalue?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            location.reload();
          }).catch(er=>console.log(er))
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
        //删除的方法
        dele:function(index,row){
          var url="http://localhost:8080/api/perpor/delspoper?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            location.reload();
          }).catch(er=>console.log(er))
        },
        //修改的弹框
        showupdate:function (index,row) {
          this.upForm=true;
          var url="http://localhost:8080/api/perpor/selectById?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.upDate=rs.data.data;
          }).catch(er=>console.log(er))
        },
        //修改提交
        updateForm:function () {
          this.$refs['upDate'].validate(res=>{
            if(res==true){
              this.$ajax.post("http://localhost:8080/api/perpor/updatespor",this.$qs.stringify(this.upDate)).then(rs=>{
                this.upForm=false;
                location.reload();
              }).catch(er=>console.log(er))
            }
          })
        },
        //新增的弹框
        adda:function(){
         this.addForm=true;
         this.addData={};
        },
        //新增的方法
        saveForm:function () {
          this.$refs['addData'].validate(res=>{
            if(res==true){
              console.log(this.addData)
              this.$ajax.post("http://localhost:8080/api/perpor/savespoper",this.$qs.stringify(this.addData)).then(rs=>{
                this.addForm=false;
                location.reload();
              }).catch(er=>console.log(er));
            }
          });
        },
        //查询的方法
        queryDate: function () {
          var par = this.$qs.stringify(this.param);
          var url = "http://localhost:8080/api/perpor/queryspoper?" + par;
          this.$ajax.get(url).then(rs => {
            this.quydate = rs.data.data.list;
            this.count = rs.data.data.count;
          }).catch(er => console.log(er))
        },
        //查询类型的方法
        queryType: function () {
          this.$ajax.get("http://localhost:8080/api/type/getData").then(res => {
            this.typeData = res.data.data;
            this.getChildrenType();
            //遍历所有的子节点
            for (let i = 0; i <this.types.length ; i++) {
              this.typeName=""; // 全局变量   临时存 层级名称
              //处理子节点的name属性
              this.diguiNode(this.types[i]);
              //   a/b/c/f/d/e
              //给name重新赋值
              this.types[i].name=this.typeName.split("/").reverse().join("/").indexOf("/");
            }

          }).catch(err => console.log(err));
        },
        diguiNode: function (node) {
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.typeData.length ; i++) {
              if(node.pid==this.typeData[i].id){
                this.diguiNode(this.typeData[i]);
                break;
              }
            }

          }else{
            this.typeName+="/"+node.name;
          }
        },
        getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.typeData.length ; i++) {
            let  node=this.typeData[i];
            this.isParent(node);
          }
        },
        isParent: function (node) {
          let rs=true; //标示
          for (let i = 0; i <this.typeData.length ; i++) {
            if(node.id==this.typeData[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.types.push(node);
          }
        },
        //处理属性的类型
        formaTypeId(row,column,value,index){
          for (let i = 0; i <this.typeData.length; i++) {
            if(value==this.typeData[i].id)
            {return this.typeData[i].name}
          }
        },
        //处理属性sku的类型
        SKU(row,column,value,index){
          return value==1?"是":"否"
        },
        //处理属性值的类型
        formaperId(row,column,value,index){
          for (let i = 0; i <this.pearDate.length; i++) {
            if(value==this.pearDate[i].id)
            {return this.pearDate[i].nameCH}
          }
        }
      }
    }
</script>

<style scoped>

</style>
