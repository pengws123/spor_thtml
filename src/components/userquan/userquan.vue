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
</div>
</template>

<script>
    export default {
        name: "userquan",
      data(){
          return{
            data:[],//用来渲染树
            defaultProps: {},
            ajaxDate:[],//用来接收后台传来的值
            jsonstr:"",//用来 放进行拼接的值
          }
      },
      methods:{
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
            this.jsonstr+='{"id":'+obj.id+',"label":"'+obj.name+'","children":[';
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
            this.jsonstr+='{"id":'+obj.id+',"label":"'+obj.name+'"}';
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
