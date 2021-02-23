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
            <el-button size="mini" class="el-icon-setting"  @click="xigsu(scope.row)">维护权限</el-button>
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

    <!--新增角色权限模板-->
    <div>
      <el-dialog title="角色权限模板" :visible.sync="addquForm">

          <el-tree
            :data="data"
            :props="defaultProps"
            accordion
            show-checkbox
            :expand-on-click-node="false"
          >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
      </span>
          </el-tree>

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
              sizes:[2,10,15],
              size:2,
              start:1
            },
            //总条数
            count:0,
            //查询出来的数据
            quydate:[],
            //新增角色弹框值
            addsxForm:false,
            //新增角色权限弹框值
            addquForm:false,
            data:[],//用来渲染树
            ajaxDate:[],//用来接收后台传来的值
            jsonstr:"",//用来 放进行拼接的值
            //选中权限的数组
            addqudate:[],
            defaultProps: {},
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
        xigsu:function(){
          this.addquForm=true;
        },
        //遍历赋值
        queryDates:function () {
          for (let i = 0; i <this.ajaxDate.length ; i++) {
            if(this.ajaxDate[i].pid==0){
              this.diguiNode(this.ajaxDate[i]);
              break;
            }
          }
          this.data.push(JSON.parse(this.jsonstr))
        },
        //递规进行循环
        diguiNode:function(obj){
          var isPar=this.isPared(obj);
          if(isPar==true){
            let co=0;
            this.jsonstr+='{"id":'+obj.id+',"pid":'+obj.pid+',"label":"'+obj.name+'","url":"'+obj.url+'","type":'+obj.type+',"children":[';
            for (let i = 0; i <this.ajaxDate.length ; i++) {
              if(obj.id==this.ajaxDate[i].pid){
                co++;
                this.diguiNode(this.ajaxDate[i]);
                this.jsonstr+=",";
              }
            }
            if(co!=0){
              this.jsonstr=this.jsonstr.substr(0,this.jsonstr.length-1);
            }
            this.jsonstr+=']}';
          }else {
            this.jsonstr+='{"id":'+obj.id+',"pid":'+obj.pid+',"label":"'+obj.name+'","url":"'+obj.url+'","type":'+obj.type+'}';
          }

        },
        //判断是不是父节点
        isPared:function(obj){
          for (let i = 0; i <this.ajaxDate.length ; i++) {
            if(obj.id==this.ajaxDate[i].pid){
              return true;
            }
          }
          return false;
        },
      },
      //初始化函数
      created:function () {
        this.$ajax.get("http://localhost:8080/api/xian/getshore").then(rs=>{
          this.ajaxDate=rs.data.data;
          console.log(this.ajaxDate)
          this.queryDates();
        }).catch(er=>console.log(er))
        this.queryDate();
      }
    }
</script>

<style scoped>

</style>
