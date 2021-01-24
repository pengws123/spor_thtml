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
        <el-form ref="shopAdd" :rules="rule"  :model="shopAdd" label-width="80px">

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="shopAdd.name" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品标题" prop="title">
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

          <el-form-item label="商品介绍" prop="productdecs">
            <el-input type="textarea" style="width: 200px"  v-model="shopAdd.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="shopAdd.price"  :step="1" :min="0" :max="1000"></el-input-number>
          </el-form-item>

          <el-form-item label="商品库存" prop="stocks">
            <el-input-number v-model="shopAdd.stocks"  :step="1" :min="0" :max="1000"></el-input-number>
          </el-form-item>

          <el-form-item label="排序字段" prop="sortNum">
            <el-input-number v-model="shopAdd.sortNum"  :step="1" :min="0" :max="1000"></el-input-number>
          </el-form-item>
        </el-form>
      </div>


      <div class="info" v-if="active==2">

        <el-form :model="shopAdd"  ref="addData"  label-width="80px">

          <el-form-item label="属性类型" prop="typeId">
            <el-select v-model="shopAdd.typeId" placeholder="请选择" @change="getAttrData">
              <el-option
                v-for="item in typeData"
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
                <el-option  v-for="b in a.values" :key="b.id"  :label="b.nameCH" :value="b.id"></el-option>
              </el-select>

              <el-radio-group v-if="a.type==1" v-model="a.ckValues">
                <el-radio v-for="b in a.values"  :key="b.id" :label="b.nameCH"></el-radio>
              </el-radio-group>


              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" @change="$forceUpdate()">
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
        var  ckPrice=(rule,value,callback)=>{ // 自定义规则  要求的函数参数为三个     第二个是验证的值  第三个回调函数（返回的值）
          if(value<=3){
            callback(new Error("不能小于0.30"));
          }else{
            callback();
          }

        };var  ckstocks=(rule,value,callback)=>{ // 自定义规则  要求的函数参数为三个     第二个是验证的值  第三个回调函数（返回的值）
          if(value<=30){
            callback(new Error("不能小于30"));
          }else{
            callback();
          }

        };var  cksortNum=(rule,value,callback)=>{ // 自定义规则  要求的函数参数为三个     第二个是验证的值  第三个回调函数（返回的值）
          if(value<=300){
            callback(new Error("不能小于300"));
          }else{
            callback();
          }

        }
            return{
              //规格
              tableShow:false,
              //移动的下标
              active: 1,
              //新增的对象
              shopAdd:{},
              //属性的数组
              BrandData:{},
              //获取类型的数据
              typeData:[],
              //递规类型
              types:[],
              //递归拼接处理
              typeName:"",
              //sku属性对象
              SKUData:[],
              //属性值对象
              attData:[],
              //规格的table
              tableData:[], //确定sku复选框绑定的变量名
              //动态表头
              cols:[],
              rule:{ //验证规则
                name:[
                  { required: true, message: '请输入属性值的名称', trigger: 'blur' },
                  { max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' },
                  { validator:checkname,trigger: 'blur' }
                ],
                title: [
                  { required: true, message: '请输入表头', trigger: 'blur' }
                ],
                productdecs: [
                  { required: true, message: '请输入介绍', trigger: 'blur' }
                ],
                price: [
                  {validator:ckPrice,trigger: 'change' }
                ],
                stocks: [
                  {validator:ckstocks,trigger: 'change' }
                ],
                sortNum: [
                  {validator:cksortNum,trigger: 'change' }
                ],
              }
            }
      },
      methods: {
          //新增提交
        addProduct:function(){

        let arrt=[];
          for (let i = 0; i <this.attData.length ; i++) {
          let  attData={};
            attData[this.attData[i].name]=this.attData[i].ckValues;
            arrt.push(attData);
          }
          this.shopAdd.attr=JSON.stringify(arrt);
          this.shopAdd.sku=JSON.stringify(this.tableData);
          this.$ajax.post("http://localhost:8080/api/pin/savesshangpin",this.$qs.stringify(this.shopAdd)).then(res=>{
            this.shopAdd={};
            this.$message.success("添加成功");
            this.$router.push("/shangquery");

          })
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
          //强制刷新组件
          this.$forceUpdate();
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
        },
        //下边移动的按钮
        next:async function() {
          this.$refs['shopAdd'].validate(r=>{
            if(r==true){

          if (this.active++ > 3) this.active = 1;
            }
          });
          if (this.active==2){
            if(this.typeData.length==0){
              await this.queryType();
            }
          }

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
          this.$ajax.get("http://localhost:8080/api/perpor/queryByTypeIds?typeId="+typeId).then(res=>{

            this.SKUData=res.data.data.skuDatas;

            for (let i = 0; i <this.SKUData.length ; i++) {
              this.SKUData[i].ckValues=[];
            }
            this.attData=res.data.data.attrDatas;
            debugger;
            for (let i = 0; i <this.attData.length ; i++) {
              if(this.attData[i].type==2){
              this.attData[i].ckValues=[];

            }

            }
          })
        },
        //查询类型的方法
        queryType:async function () {
        let res= await  this.$ajax.get("http://localhost:8080/api/type/getData")
            this.getChildrenType(res.data.data);

        },
        //循环递规
        getChildrenType:function(datas){
          for (let i = 0; i <datas.length ; i++) {
            let  node=datas[i];
            let falg=true;
            for (let j = 0; j <datas.length  ; j++) {
              if (node.id==datas[j].pid) {
                falg=false;
                break;
              }
            }
            if(falg==true){
              this.typeData.push(node);
            }
          }
        },
        //查询  商品的内容
        queryDate: async function () {
          let param={start:1,size:100000000};
          var par=this.$qs.stringify(param);
          let rs= await this.$ajax.get("http://localhost:8080/api/name/queryspname?"+par);
           this.BrandData=rs.data.data.list;
        }
      },
      //初始化函数
      created: async function () {
      await  this.queryType();
        await  this.queryDate();
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
