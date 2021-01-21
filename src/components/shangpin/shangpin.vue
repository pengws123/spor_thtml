<template>
  <div class="body">
    <div class="tbody">
      <el-steps :active="active" finish-status="success">
        <el-step title="商品信息"></el-step>
        <el-step title="属性信息"></el-step>
        <el-step title="提交"></el-step>
      </el-steps>
      <!-- 个人信息 -->
      <div class="info" v-if="active==1">
        <el-form ref="shopAdd" :model="shopAdd" label-width="80px">

          <el-form-item label="商品名称">
            <el-input v-model="shopAdd.name" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品标题">
            <el-input v-model="shopAdd.title" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="bandId">
            <el-select v-model="shopAdd.bandId" placeholder="请选择分类">
              <el-option v-for="item in BrandData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
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

          <el-form-item label="商品介绍">
            <el-input type="textarea" style="width: 200px"  v-model="shopAdd.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="shopAdd.price" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品库存">
            <el-input v-model="shopAdd.stocks" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="排序字段">
            <el-input v-model="shopAdd.sortNum" style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </div>


      <div class="info" v-if="active==2">

        <el-form :model="addData"  ref="addData"  label-width="80px">

          <el-form-item label="属性类型" prop="typeId">
            <el-select v-model="addData.typeId" placeholder="请选择" @change="getAttrData">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="SKUData.length>0" label="商品规格">

            <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.nameCH">

              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" @change="skuChange">
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH"></el-checkbox>
              </el-checkbox-group>



            </el-form-item>

          </el-form-item>


          <el-table
            v-if="tableShow"
            :data="tableData"
            label="规格"
            style="width: 100%">
            <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
            </el-table-column>

            <el-table-column
              label="库存"
              width="180">

              <template slot-scope="scope">
                <el-input  v-model="scope.row.kucun"/>
              </template>

            </el-table-column>
            <el-table-column
              label="价格"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jiage"/>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item v-if="attData.length>0" label="商品参数">

            <el-form-item v-for="a in  attData" :key="a.id" :label="a.nameCH">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-input v-if="a.type==3" v-model="a.ckValues"></el-input>


              <el-select v-if="a.type==0" v-model="a.ckValues"  placeholder="请选择">
                <el-option  v-for="b in a.values" :key="b.id"  :label="b.nameCH" :value="b.nameCH"></el-option>
              </el-select>

              <el-radio-group v-if="a.type==1" v-model="a.ckValues">
                <el-radio v-for="b in a.values"  :key="b.id" :label="b.nameCH"></el-radio>
              </el-radio-group>


              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues">
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
              </el-checkbox-group>



            </el-form-item>

          </el-form-item>

          <el-button type="primary" @click="addProduct">添加</el-button>
        </el-form>


      </div>
      <div class="info" v-if="active==3">
        商品提交
      </div>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px;" @click="pre" v-if="active>1">上一步</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "shangpin",
      data (){
            return{
              //规格
              tableShow:false,
              //移动的下标
              active: 1,
              //新增的对象
              shopAdd:{},
              //新增规格
              saveAdd:{
              },
                fuxuan:[],
              //属性的数组
              BrandData:{},
              //获取类型的数据
              typeData:[],
              //递规类型
              types:[],
              //递归拼接处理
              typeName:"",
              //新增的对象
              addData:{
              },
              //sku属性对象
              SKUData:[],
              //属性值对象
              attData:[],
              //规格的table
              tableData:[], //确定sku复选框绑定的变量名
              //动态表头
              cols:[]
            }
      },
      methods: {
          //新增提交
        addProduct:function(){
        this.shopAdd.perporId=this.addData.typeId;
          console.log(this.attData);
        let arrt=[];
          for (let i = 0; i <this.attData.length ; i++) {
          let  attData={};
            attData[this.attData[i].name]=this.attData[i].ckValues;
            arrt.push(attData);
          }
          this.shopAdd.attr=JSON.stringify(arrt);
          this.shopAdd.sku=JSON.stringify(this.tableData);
          this.$ajax.post("http://localhost:8080/api/pin/savesshangpin",this.$qs.stringify(this.shopAdd)).then(res=>{
            this.$message.success("添加成功");
            this.$router.push("/shangquery");
            location.reload();
          })
        },
        //笛卡尔积
        discarts:function() {
          var twodDscartes = function (a, b) {
            var ret = [];
            for (var i = 0; i < a.length; i++) {
              for (var j = 0; j < b.length; j++) {
                ret.push(ft(a[i], b[j]));
              }
            }
            return ret;
          }
          var ft = function (a, b) {
            if (!(a instanceof Array))
              a = [a];
            var ret = a.slice(0);
            ret.push(b);
            return ret;
          }
          //多个一起做笛卡尔积
          return (function (data) {
            var len = data.length;
            if (len == 0)
              return [];
            else if (len == 1)
              return data[0];
            else {
              var r = data[0];
              for (var i = 1; i < len; i++) {
                r = twodDscartes(r, data[i]);
              }
              return r;
            }
          })(arguments.length > 1 ? arguments : arguments[0]);
        },
        //监听sku属性 改变事件
        skuChange:function(){
         // console.log(this.SKUData);
          //清空动态列头
          this.cols=[];
          this.tableData=[];
          //判断是否要生成笛卡尔积
          var dika=[];
          let flag=true;
          for (let i = 0; i <this.SKUData.length ; i++) {
        this.cols.push({"id":this.SKUData[i].id,"nameCH":this.SKUData[i].nameCH,"name":this.SKUData[i].name});
        //console.log(this.cols)
            dika.push(this.SKUData[i].ckValues);
            if(this.SKUData[i].ckValues.length==0){
              flag=false;
              break;
            }
          }
          if(flag==true){
          let  ss = this.discarts(dika);
            for (let i = 0; i <ss.length; i++) {
              let  zhi= ss[i];
              let  tableValue={};
              if(typeof zhi=="object") {
                for (let j = 0; j < zhi.length; j++) {
                  let key = this.cols[j].name;
                  //  console.log(key)
                  tableValue[key] = zhi[j];
                }
              }else {
                let key = this.cols[0].name;
                //  console.log(key)
                tableValue[key] = zhi;

              }
              this.tableData.push(tableValue);
              //console.log(this.tableData);
            }
          }
          this.tableShow=flag;
        },
        //下边移动的按钮
        next() {
          if (this.active++ > 3) this.active = 1;
        },
        pre() {
          if (this.active-- < 2) this.active = 1;
        },
        //图片
        imgCallBack:function(response, file, fileList){

          this.shopAdd.imgPath=response.data;
        },
        //初始化商品属性
        getAttrData:function(typeId){
         // console.log(typeId);
          this.SKUData=[];
          this.attData=[];
        this.$ajax.get("http://localhost:8080/api/perpor/queryByTypeID?typeId="+typeId).then(res=>{
          // 所有的属性数据
          let attrDatas=res.data.data;
          //判断分类是否有数据   更新 参数和规格
          if(attrDatas.length>0){
            //初始化  attData      SKUData
            for (let i = 0; i <attrDatas.length ; i++) {
              //判断是否为sku属性
              if(attrDatas[i].isSKU==2){

                if(attrDatas[i].type!=3){
                  attrDatas[i].ckValues=[];
                  //发起请求 查询此属性对应的选项值
                  this.$ajax.get("http://localhost:8080/api/sxvalue/querysxvalue?attId="+attrDatas[i].id).then(res=>{
                    attrDatas[i].values=res.data.data;
                    this.attData.push(attrDatas[i]);
                  })
                }else {
                  this.attData.push(attrDatas[i]);
                }
              }else{
                if(attrDatas[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$ajax.get("http://localhost:8080/api/sxvalue/querysxvalue?attId="+attrDatas[i].id).then(res=>{
                    attrDatas[i].values=res.data.data;

                    attrDatas[i].ckValues=[];

                    this.SKUData.push(attrDatas[i]);
                  //  console.log(this.SKUData);
                  })
                }
                else {
                  attrDatas[i].ckValues=[];
                  this.attData.push(attrDatas[i]);
                }
              }
            }
          }else{
            this.SKUData=[];
            this.attData=[];
          }
        })
        //  console.log(this.attData);
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
              this.types[i].name=this.typeName.split("/").reverse().join("/").substr(0,this.typeName.length-1);
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
        //查询  商品的内容
        queryDate:function () {
          let param={start:1,size:100000000};
          var par=this.$qs.stringify(param);
          var url="http://localhost:8080/api/name/queryspname?"+par;
          this.$ajax.get(url).then(rs=>{
            this.BrandData=rs.data.data.list;
          }).catch(er=>console.log(er))
        }
      },
      //初始化函数
      created:function () {
        this.queryType();
        this.queryDate();
      }
    }
</script>

<style scoped>
  .tbody{
    width:80%;
    margin-left:10%;
    margin-top: 2%;

  }
</style>
