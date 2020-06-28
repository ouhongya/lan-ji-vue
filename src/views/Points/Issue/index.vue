<template>
  <el-card class="card-layout" shadow="hover" align="center">
    <el-form :model="Points" :rules="rules" ref="Points" label-width="100px" class="demo-ruleForm">
      <el-form-item label="发放对象:" prop="type">
        <el-select v-model="Points.type" size="small" style="width: 100%;" placeholder="请选择活动区域">
          <el-option label="全部用户" :value="1"></el-option>
          <el-option label="敬请期待" disabled value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放通知:" prop="intro">
        <el-input size="small" type="textarea" v-model="Points.intro" :row="5" placeholder="请输入您的发放通知"/>
      </el-form-item>
      <el-form-item label="发放数量:" prop="number">
        <el-input size="small" type="number" v-model="Points.number" placeholder="请输入您的发放数量"/>
      </el-form-item>
      <el-form-item style="margin-right: 20%">
        <el-button type="primary" size="small" round @click="qx">取消</el-button>
        <el-button type="primary" size="small" round @click="submitForm(`Points`)">发放</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {giveIntegral} from "@/api/points/index"
  export default {
    data() {
      return {
        Points: {
          type: null,
          intro:null,
          number:null
        },
        rules: {
          type: [
            {required: true, message: '至少选择一类发放的用户', trigger: 'change'}
          ],
          intro: [
            {required: true, message: '请填写发放通知', trigger: 'blur'}
          ],
          number: [
            {required: true, message: '请填写发放数量', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(Points) {
        this.$refs[Points].validate((valid) => {
          if (valid) {
            let obj = {
              notice:this.Points.intro,
              num:Number(this.Points.number),
              types:this.Points.type
            }
            giveIntegral(obj).then(res=>{
              if(res.queue.code===1) {
                this.mess("发放成功","success")
                this.$router.push({path: "/Points/PointsList"})
              }else{
                this.mess("服务器繁忙","warning")
              }
            })
          } else {
            return false;
          }
        });
      },
      qx() {
        this.$router.push({path:`/Points/PointsList`})
      }
    }
  }
</script>

<style scoped>
  .card-layout {
    margin: 0 auto;
    margin-top: 4%;
    width: 500px;
  }
</style>
