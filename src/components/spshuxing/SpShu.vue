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

  <!--新增模板-->
  <div>
    <el-dialog title="属性新增信息" :visible.sync="addForm">
      <el-form :model="addData" ref="addData"  label-width="80px">
        <el-form-item label="英文名称" prop="name">
          <el-input v-model="addData.name" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCH">
          <el-input v-model="addData.nameCH" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="属性类型" prop="typeId">
          <el-select v-model="addData.typeId" placeholder="请选择">
            <el-option
              v-for="item in bandData"
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
        <el-form-item label="SKU" prop="isSKU">
          <el-switch
            v-model="addData.isSKU"
            active-text="是"
            active-color="#13ce66"
            :active-value="1"
            inactive-text="否"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveForm">确 定</el-button>
        <el-button @click="addForm = false">取 消</el-button>
      </div>
    </el-dialog>
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
            //获取类型的数据
            typeData:[],
            //类型属性
            bandData:[],
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
            rule:{ //验证规则
              carname:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
              ]
            }
        }
      } ,
      //初始化函数
      created:function () {
        this.queryDate();
        this.queryType();
      },
      methods: {
        //第几页
        handleCurrentChange: function (page) { //页数
          this.param.start = page;
          this.queryDate();
          //每页条数
        }, handleSizeChange: function (size) { //条数
          this.param.size = size;
          this.queryDate();
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
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pid == -1) {
                this.diguiNode(res.data.data[i]);
                break;
              }
            }
          }).catch(err => console.log(err));
        },
        diguiNode: function (node) {
          // 判断是否为父节点
          var bf = this.isParent(node);
          if (bf == true) {
            for (let i = 0; i < this.typeData.length; i++) {
              //判断是否为当前节点的子节点
              if (node.id == this.typeData[i].pid) {
                this.diguiNode(this.typeData[i]);
              }
            }
          }
          if (bf == false) {
            this.bandData.push(node)
          }
        },
        isParent: function (node) {// 判断是否为父节点  pid 有没有指向当前id
          for (let i = 0; i < this.typeData.length; i++) {
            if (node.id == this.typeData[i].pid) {
              return true;
            }
          }
          return false;
      },
        formaTypeId(row,column,value,index){
          for (let i = 0; i <this.typeData.length; i++) {
            if(value==this.typeData[i].id)
            {return this.typeData[i].name}
          }
        },
        SKU(row,column,value,index){
          return value==1?"是":"否"
        },
      }
    }
</script>

<style scoped>

</style>
