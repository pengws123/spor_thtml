<template>
<div align="center">
  <el-button type="success" @click="adda()">新增</el-button>
  <el-table :data="queryData" style="width: 100%"  border >


    <el-table-column label="序号" prop="id"  align="center">
    </el-table-column>

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

    <el-table-column label="属性类型" prop="typeId"  align="center">
      <template slot-scope="scope">
      <el-button mini  @click="xiugai(scope.row.typeId,scope.row.id)">点击查看</el-button>
      </template>
    </el-table-column>


    <el-table-column label="排序字段" prop="sortNum"  align="center">
    </el-table-column>

    <el-table-column
      align="center" label="操作">
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
      <el-form :model="upDate" :rules="rule"  ref="upDate"  label-width="80px">

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

  <!-- 修改  -->
  <div>
    <el-dialog title="修改商品属性信息" :visible.sync="upFormType">

      <el-form :model="addData"  ref="addData" :rules="rule" label-width="80px">

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

        <el-form-item v-if="SKUData.length>0" label="商品规格" >

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
              <el-option  v-for="b in a.values" :key="b.id"  :label="b.nameCH" :value="b.id"></el-option>
            </el-select>

            <el-radio-group v-if="a.type==1" v-model="a.ckValues">
              <el-radio v-for="b in a.values"  :key="b.id" :label="b.nameCH"></el-radio>
            </el-radio-group>


            <el-checkbox-group v-if="a.type==2" v-model="fuxuan">
              <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
            </el-checkbox-group>



          </el-form-item>

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
            //修改属性值的弹框值
            upFormType:false,
            //查询出来的数据
            queryData:[],
            //查询属性值的对象
            queryPro:[],
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
            upDate:{},
          /*  //属性的数组
            BrandData:{},*/
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
            cols:[],
            //规格
            tableShow:false,
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
      },
      created:function () {
          //查询添加的商品
        this.queryShuxing();
        //查询商品属性
        this.queryDate();
        this.queryType();
      },
      methods:{
        //修改属性值的弹框
        xiugai:function(typeId,id){
          this.upFormType=true;
          this.addData.typeId=typeId;
          this.getAttrData2(typeId,id);
        this.skuChange();

        },
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
            // console.log(this.queryData);
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
        },
        //笛卡尔积
        calcDescartes:function(array) {
          if (array.length < 2) return array[0] || [];
          return [].reduce.call(array, function (col, set) {
            var res = [];
            col.forEach(function (c) {
              set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
              })
            });
            return res;
          });
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
            let  ss = this.calcDescartes(dika);
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
        }, //初始化商品属性
        getAttrData2:function(typeId,id){
          this.$ajax.get("http://localhost:8080/api/pin/selectByPerId?proId="+id).then(rs=>{
              let datas=rs.data.data;
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
                    //回显
                    if(attrDatas[i].type==2){
                      if(this.getValeu(attrDatas[i].name,datas)==""){
                        attrDatas[i].ckValues=[];
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      }
                    }else{
                      attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                    }
                    //发起请求 查询此属性对应的选项值
                    this.$ajax.get("http://localhost:8080/api/sxvalue/querysxvalue?attId="+attrDatas[i].id).then(res=>{
                      attrDatas[i].values=res.data.data;
                      this.attData.push(attrDatas[i]);
                    })
                  }else {
                    attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                    this.attData.push(attrDatas[i]);
                  }
                }else{
                  if(attrDatas[i].type!=3){
                    //回显
                    if(attrDatas[i].type==2){
                      if(this.getValeu(attrDatas[i].name,datas)==""){
                        attrDatas[i].ckValues=[];
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      }
                    }else{
                      attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                    }

                    //发起请求 查询此属性对应的选项值
                    this.$ajax.get("http://localhost:8080/api/sxvalue/querysxvalue?attId="+attrDatas[i].id).then(res=>{
                      attrDatas[i].values=res.data.data;

                      //attrDatas[i].ckValues=[];
                      attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
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
          })
          //  console.log(this.attData);
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
        //data 回显数据   [{},{}]
        getValeu:function(key,data){
          let  arrTable=[];
          for (let i = 0; i <data.length ; i++) {
            //得到一个数据 将字符串转为json
            let  objData=JSON.parse(data[i].attrData);
            if(objData[key]!=null){
              if(data[i].storcks!=null){
              if(arrTable.indexOf(objData[key])==-1){
                arrTable.push(objData[key]);
                console.log(arrTable);
              }
              }else {
              return objData[key];
              }
            }
          }
          return arrTable;
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

        }
      }
    }
</script>

<style scoped>

</style>
