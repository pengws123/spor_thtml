<template>
<div>
  <h1>用户权限管理</h1>
  <el-tree
    :data="data"
    :props="defaultProps"
    accordion
    show-checkbox
    :expand-on-click-node="false"
  >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => update(node, data)">
            修改
          </el-button>
        </span>
      </span>
  </el-tree>

  <!--新增-->
  <el-dialog title="新增权限信息" :visible.sync="addFormFlag" width="500px">

    <el-form :model="addForm" ref="addForm" label-width="80px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="addForm.name" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="路径" prop="url">
        <el-input v-model="addForm.url" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="类型:" prop="type">
        <el-radio-group v-model="addForm.type">
          <el-radio   :label="0">目录</el-radio>
          <el-radio   :label="1">菜单</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addFormFlag = false">取 消</el-button>
      <el-button type="primary" @click="addtijiao">确 定</el-button>
    </div>

  </el-dialog>


  <!--修改-->
  <el-dialog title="录入分类产品信息" :visible.sync="upFormFlag" width="500px">

    <el-form :model="upForm" ref="upForm"  label-width="80px">
      <el-input type="hidden" v-model="upForm.id" autocomplete="off" ></el-input>
      <el-input type="hidden" v-model="upForm.pid" autocomplete="off" ></el-input>
      <el-form-item label="名称" prop="name">
        <el-input v-model="upForm.name" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="路径" prop="url">
        <el-input v-model="upForm.url" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="类型:" prop="type">
        <el-radio-group v-model="upForm.type">
          <el-radio   :label="0">目录</el-radio>
          <el-radio   :label="1">菜单</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="upFormFlag = false">取 消</el-button>
     <el-button type="primary" @click="uptijiao">确 定</el-button>
    </div>

  </el-dialog>

</div>
</template>

<script>
    export default {
        name: "userquan",
      data(){
          return{
            data:[],//用来渲染树
            defaultProps: {},
            addFormFlag:false,
            upFormFlag:false,
            ajaxDate:[],//用来接收后台传来的值
            jsonstr:"",//用来 放进行拼接的值
            addForm:{
              pid:"",
              name:"",
              url:"",
              type:""
            },
            upForm:{
              id:"",
              pid:"",
              name:"",
              url:"",
              type:""
            },
            delform:{
              id:""
            }
          }
      },
      methods:{
          //删除
        remove:function (node, data) {
          this.delform.id=data.id;
          this.$ajax.post("http://localhost:8080/api/xian/deleteshore",this.$qs.stringify(this.delform)).then(rs=>{
            location.reload();
          }).catch(er=>console.log(er))
        },
        //修改的弹框
        update:function (node, data) {
          this.upFormFlag=true;
          console.log(node);
          console.log(data)
          this.upForm.id=data.id;
          this.upForm.pid=data.pid;
          this.upForm.name=data.label;
          this.upForm.url=data.url;
          this.upForm.type=data.type;
        },
        //修改提交
        uptijiao:function () {
          this.$ajax.post("http://localhost:8080/api/xian/updateshore",this.$qs.stringify(this.upForm)).then(rs=>{
            this.upFormFlag=false;
            location.reload();
          }).catch(er=>console.log(er))
        },
        //新增的弹框
        append:function (data) {
          this.addFormFlag=true;
          this.addForm.pid=data.id;
        },
        //新增的提交
        addtijiao:function () {
          this.$ajax.post("http://localhost:8080/api/xian/saveshore",this.$qs.stringify(this.addForm)).then(rs=>{
            this.addFormFlag=false;
            location.reload();
          }).catch(er=>console.log(er))
        },
        //遍历赋值
        queryDate:function () {
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
            this.jsonstr+='{"id":'+obj.id+',"pid":'+obj.pid+',"label":'+obj.name+',"url":"'+obj.url+'","type":'+obj.type+',"children":[';
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
      }
      //初始化函数
      ,
      created:function () {
        this.$ajax.get("http://localhost:8080/api/xian/getshore").then(rs=>{
          this.ajaxDate=rs.data.data;
          this.queryDate();
        }).catch(er=>console.log(er))
      }
    }
</script>

<style scoped>

</style>
