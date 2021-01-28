<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rule" ref="param" label-width="0px" class="ms-content">
                <el-form-item prop="realName">
                    <el-input v-model="param.realName" placeholder="realName">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" size="mini" @click="submitForm()">登录</el-button>
                </div>
              <div class="login-btn">
                    <el-button type="info" size="mini" @click="intoForm()">注册</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>


      <!-- 新增  -->
      <el-dialog title="用户信息" :visible.sync="addForm">
        <el-form :model="addData" ref="addData" :rules="rule"  label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-col :span="11">
            <el-input v-model="addData.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="账号" prop="realName">
            <el-col :span="11">
            <el-input v-model="addData.realName" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-col :span="11">
            <el-input v-model="addData.password" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="性别:" prop="sex">
            <el-radio-group v-model="addData.sex">
              <el-radio   :label="1">男</el-radio>
              <el-radio   :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-col :span="11">
            <el-input v-model="addData.phone" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-col :span="11">
            <el-input v-model="addData.email" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="身份证号" prop="idCard">
            <el-col :span="11">
            <el-input v-model="addData.idCard" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="时间" prop="birthday">
            <el-date-picker
              v-model="addData.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="头像">
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
            <el-select v-model="addData.eduId" placeholder="请选择">
              <el-option
                v-for="item in eduData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>

          <el-form-item label="部门" prop="deprId">
            <el-select v-model="addData.deprId" placeholder="请选择">
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
          <el-button type="primary" @click="saveForm">确 定</el-button>
        </div>

      </el-dialog>

    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                 realName:"",
                password:""
            },
          //新增的对象
          addData:{},
          //新增的弹框
          addForm:false,
          //学历下拉
          eduData:[{"value":1,"label":"高中"},{"value":2,"label":"大专"},{"value":3,"label":"本科"}],
          //部门下拉
          depData:[{"value":1,"label":"人事"},{"value":2,"label":"全粘"},{"value":3,"label":"完全粘"}],
          rule: {
              realName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm:function() {
            this.$refs['param'].validate(valid => {
                if (valid==true) {
                  this.$ajax.post("http://localhost:8080/api/user/loginuser",this.$qs.stringify(this.param)).then(res=>{
                    if (res.data.data.mags==1){
                      this.$message.success('登录成功');
                      localStorage.setItem('ms_username', this.param.realName);
                      this.$router.push('/test');
                    }
                    if (res.data.data.mags==2){
                      this.$message.success('密码不正确');
                      localStorage.setItem('ms_username', this.param.realName);
                    }
                    if (res.data.data.mags==3){
                      this.$message.success('账号不存在');
                      localStorage.setItem('ms_username', this.param.realName);
                    }
                  })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
      //图片
      imgCallBack:function(response, file, fileList){

        this.addData.imgUrl=response.data;
      },
      //新增的弹框
      intoForm:function () {
      this.addForm=true;
        this.addData={};
      },
      //新增的方法
      saveForm:function () {
        this.$refs['addData'].validate(res=>{
          if(res==true){
            console.log(this.addData)
            this.$ajax.post("http://localhost:8080/api/user/saveuser",this.$qs.stringify(this.addData)).then(rs=>{
              if (rs.data.data.mags==1){
                this.$message.success('注册成功');
                this.addForm=false;
                location.reload();
              }
              if (rs.data.data.mags==2){
                this.$message.success('账号已存在');
                localStorage.setItem('ms_username', this.param.realName);
              }
            }).catch(er=>console.log(er));
          }
        });
      },
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
