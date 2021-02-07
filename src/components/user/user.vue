<template>
  <div>
    <!-- 查询  -->
    <div>
      <el-table
        :data="quydate"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
         >
        </el-table-column>

        <el-table-column
          prop="name"
          label="名字"
        >
        </el-table-column>

        <el-table-column
          prop="realName"
          label="账号"
        >
        </el-table-column>

        <el-table-column
          prop="sex"
          :formatter="SEX"
          label="性别"
        >
        </el-table-column>

        <el-table-column
          prop="phone"
          label="手机号"
        >
        </el-table-column>

        <el-table-column
          prop="birthday"
          label="生日"
        >
        </el-table-column>

        <el-table-column
          prop="imgUrl"
          label="头像"
        >
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgUrl"/>
          </template>
        </el-table-column>

        <el-table-column
          prop="eduId"
          :formatter="xueli"
          label="学历"
        >
        </el-table-column>


        <el-table-column
          prop="deprId"
          :formatter="bumen"
          label="部门"
        >
        </el-table-column>


        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button size="mini" class="el-icon-edit" @click="showupdate(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" class="el-icon-delete-solid"  @click="dele(scope.$index,scope.row)">删除</el-button>
            <el-button size="mini" class="el-icon-setting" v-if="scope.row.type!=3" @click="xigsu(scope.row)">维护角色</el-button>
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

    <!-- 修改  -->
    <el-dialog title="用户信息" :visible.sync="upForm">
      <el-form :model="upData" ref="upData"   label-width="80px">

        <el-form-item label="名称" prop="name">
          <el-col :span="11">
            <el-input v-model="upData.name" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>


        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="upData.sex">
            <el-radio   :label="1">男</el-radio>
            <el-radio   :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-col :span="11">
            <el-input v-model="upData.phone" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-col :span="11">
            <el-input v-model="upData.email" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="身份证号" prop="idCard">
          <el-col :span="11">
            <el-input v-model="upData.idCard" autocomplete="off" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="时间" prop="birthday">
          <el-date-picker
            v-model="upData.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="头像">
         <img  width="50px" :src="upData.imgUrl"/>
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

        <el-form-item label="学历" prop="eduId">
          <el-select v-model="upData.eduId" placeholder="请选择">
            <el-option
              v-for="item in eduData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="部门" prop="deprId">
          <el-select v-model="upData.deprId" placeholder="请选择">
            <el-option
              v-for="item in depData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="updateForm">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "user",
      data(){
        return{
          param:{
            //分页数据
            sizes:[2,5,7],
            size:2,
            start:1
          },
          //修改的对象
          upData:{},
          //修改信息的弹框属性
          upForm:false,
          //总条数
          count:0,
          //查询出来的数据
          quydate:[],
          //学历下拉
          eduData:[{"value":1,"label":"高中"},{"value":2,"label":"大专"},{"value":3,"label":"本科"}],
          //部门下拉
          depData:[{"value":1,"label":"人事"},{"value":2,"label":"全粘"},{"value":3,"label":"完全粘"}],
        }
      },
      methods:{
        //修改用户的弹框
        showupdate:function(index,row){
          this.upForm=true;
          var url="http://localhost:8080/api/user/selectuser?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.upData =rs.data.data;
          }).catch(er=>console.log(er))
        },
        //修改提交
        updateForm:function(){
          this.$ajax.post("http://localhost:8080/api/user/updateuser",this.$qs.stringify(this.upData)).then(rs=>{
            this.upForm=false;
            this.queryDate();
          }).catch(er=>console.log(er));
        },
        //删除用户的方法
        dele:function(index,row){
          var url="http://localhost:8080/api/user/deleteuser?id="+row.id;
          this.$ajax.post(url).then(rs=>{
            this.queryDate();
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
        //图片
        imgCallBack:function(response, file, fileList){
          this.upData.imgUrl=response.data;
        },
        //查询的方法
        queryDate: function () {
          var par = this.$qs.stringify(this.param);
          var url = "http://localhost:8080/api/user/queryuser?" + par;
          this.$ajax.get(url).then(rs => {
            this.quydate = rs.data.data.list;
            this.count = rs.data.data.count;
          }).catch(er => console.log(er))
        },
        //处理性别
        SEX(row,column,value,index){
          return value==1?"男":"女"
        },
        //处理学历
        xueli(row,column,value,index){
          for (let i = 0; i <this.eduData.length; i++) {
            if(value==this.eduData[i].value)
            {return this.eduData[i].label}
          }
        },
        //处理部门
        bumen(row,column,value,index){
          for (let i = 0; i <this.depData.length; i++) {
            if(value==this.depData[i].value)
            {return this.depData[i].label}
          }
        }
      },//初始化函数
      created:function () {
        this.queryDate();
      }
    }
</script>

<style scoped>

</style>
