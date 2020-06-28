<template>
  <el-card class="card-layout" shadow="hover">
    <el-steps :active="step" align-center>
      <el-step title="图片上传" icon="el-icon-upload"></el-step>
      <el-step title="活动信息" icon="el-icon-edit"></el-step>
      <el-step title="活动详情" icon="el-icon-document"></el-step>
      <el-step title="活动预览" icon="el-icon-view"></el-step>
    </el-steps>
    <div v-if="step===1">
      <el-form ref="activity" class="form-layout" :rules="rules" :model="activity" label-width="10  0px">
        <el-form-item label="活动封面图:" prop="url">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change='changeUpload'>
            <img v-if="activity.url" :src="activity.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
              <div class="cropper" style="text-align:center">
                <vueCropper
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber"
                  :centerBox="option.centerBox"
                  :infoTrue="option.infoTrue"
                  :fixedBox="option.fixedBox"
                  @realTime="realTime"
                ></vueCropper>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
            </div>
          </el-dialog>
        </el-form-item>
        <el-form-item label="活动详情图:" prop="detailsUrl">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change='changeUpload1'>
            <img v-if="activity.detailsUrl" :src="activity.detailsUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon1"></i>
          </el-upload>
          <el-dialog title="图片剪裁" :visible.sync="dialogVisible1" append-to-body>
            <div class="cropper-content">
              <div class="cropper" style="text-align:center">
                <vueCropper
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber1"
                  :centerBox="option.centerBox"
                  :infoTrue="option.infoTrue"
                  :fixedBox="option.fixedBox"
                  @realTime="realTime"
                ></vueCropper>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible1 = false">取 消</el-button>
              <el-button type="primary" @click="finish1" :loading="loading">确认</el-button>
            </div>
          </el-dialog>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="step===2" align="center">
      <el-form ref="activity" class="form-layout" :rules="rules" :model="activity" label-width="100px">
        <el-form-item label="活动标题:" prop="name">
          <el-input v-model="activity.name" type="text" maxlength="30" show-word-limit size="small"
                    placeholder="请输入活动标题"/>
        </el-form-item>
        <el-form-item label="主办单位:" prop="main">
          <el-input v-model="activity.main" type="text" maxlength="20" show-word-limit size="small"
                    placeholder="请输入活动主办单位"/>
        </el-form-item>
        <el-form-item label="合作单位:" prop="cooperate">
          <el-input v-model="activity.cooperate" type="text" maxlength="20" show-word-limit size="small"
                    placeholder="请输入活动合作单位"/>
        </el-form-item>
        <el-form-item label="活动时间:">
          <el-radio-group v-model="radio" size="small" v-show="radio===null">
            <el-radio :label="1" border>当天</el-radio>
            <el-radio :label="2" border>隔天</el-radio>
          </el-radio-group>
          <div v-show="radio===1" style="height: 32px">
            <el-time-picker
              is-range
              size="small"
              style="width:17rem;float: left"
              v-model="value"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
            <el-button size="small" @click="radio=null,value=null" style="float: right">返回
            </el-button>
          </div>
          <div v-show="radio===2" style="height: 32px">
            <el-date-picker
              size="small"
              style="width:22rem;float: left"
              v-model="value1"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button size="small" @click="radio=null,value1=null" style="float: right">返回
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="活动人数:" prop="sumNum">
          <el-input v-model="activity.sumNum" size="small" placeholder="请输入活动人数"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    type='number'/>
        </el-form-item>
        <el-form-item label="活动费用:">
          <el-table :data="starShopSpecs"
                    style="width: 100%" border>
            <el-table-column
              label="费用"
              align="center">
              <template slot-scope="props">
                <el-input v-model="activity.price" placeholder="请输入活动费用"
                          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type='number'/>
              </template>
            </el-table-column>
            <el-table-column
              label="人数"
              align="center">
              <template slot-scope="props">
                <el-input v-model="activity.spec" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                          placeholder="请输入单价对应的人数"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="活动地点:" prop="address">
          <el-input v-model="activity.address" type="textarea" :row="3" maxlength="40" show-word-limit size="small"
                    placeholder="请输入活动地点"/>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="step===3" align="center">
      <tinymce v-model="activity.details" style="width: 340px;margin: 10px 0px" :height="500"/>
    </div>
    <div v-if="step===4" align="center">
      <div class="activity">
        <div style="border: 2px solid #00000060;border-top-left-radius: 7px;border-top-right-radius: 7px">
          <div>
            <img
              :src="activity.detailsUrl"
              height="180" width="351" style="border-radius: 6px;">
          </div>
          <div class="item">
            <h6 class="h">
              {{activity.name}}
            </h6>
          </div>
          <div class="item-font">
            <div class="font-item">
              <div class="font-mess">
                主办单位:<span class="right">{{activity.main}}</span>
              </div>
            </div>
            <div class="font-item">
              <div class="font-mess">
                合作单位:<span class="right">{{activity.cooperate}}</span>
              </div>
            </div>
            <div class="font-item">
              <div class="font-mess">
                活动时间:<span class="right">{{new Date(activity.startTime).format(`yyyy-MM-dd hh:mm:ss`)}}&nbsp;&nbsp; {{new Date(activity.endTime).format(`yyyy-MM-dd hh:mm:ss`)}}</span>
              </div>
            </div>
            <div class="font-item">
              <div class="font-mess">
                活动人数:<span class="right">{{activity.sumNum}}</span>
              </div>
            </div>
            <div class="font-item">
              <div class="font-mess">
                活动费用:<span class="right">{{activity.price}}</span>
              </div>
            </div>
            <div class="font-item">
              <div class="font-mess">
                活动地点:<span class="right">{{activity.address}}</span>
              </div>
            </div>
          </div>
          <div class="item-span">
            <div class="note-left">
              <div class="header-line-layout"
                   style="background:#F64045 "></div>
              <div class="font-layout">活动详情</div>
            </div>
          </div>
          <div class="item-content" v-html="activity.details"></div>
        </div>
      </div>
    </div>
    <div align="center">
      <el-button type="primary" v-if="step===1" round size="small" @click="cancel">取消</el-button>
      <el-button type="primary" v-if="step!==1" round size="small" @click="step--">上一步</el-button>
      <el-button type="primary" v-if="step===1" round size="small" @click="stepOne(`activity`)">下一步</el-button>
      <el-button type="primary" v-if="step===2" round size="small" @click="stepTwo(`activity`)">下一步</el-button>
      <el-button type="primary" v-if="step===3" round size="small" @click="stepThree(`activity`)">下一步</el-button>
      <el-button type="primary" v-if="step===4" round size="small" @click="submit">完成</el-button>
    </div>
  </el-card>
</template>

<script>
  import {postFile} from '@/api/file'
  import Cropper from 'cropperjs'
  import Tinymce from "@/components/Tinymce"
  import {addActivity} from "@/api/activity/index"

  export default {
    name: "index",
    components: {Tinymce},
    data() {
      return {
        rules: {
          url: [
            {required: true, message: '请上传活动封面图', trigger: 'change'},
          ],
          detailsUrl: [
            {required: true, message: '请上传活动缩略图', trigger: 'change'},
          ],
          name: [
            {required: true, message: '请输入活动标题', trigger: 'change'},
          ],
          main: [
            {required: true, message: '请输入活动主办单位', trigger: 'change'},
          ],
          cooperate: [
            {required: true, message: '请输入活动合作单位', trigger: 'change'},
          ],
          sumNum: [
            {required: true, message: '请输入活动总人数', trigger: 'change'},
          ],
          address: [
            {required: true, message: '请输入活动地址', trigger: 'change'},
          ]
        },
        step: 1,
        activity: {
          name: null,
          url: null,
          detailsUrl: null,
          startTime: null,
          endTime: null,
          price: null,
          spec: null,
          address: null,
          details: null,
          main: null,
          cooperate: null,
          sumNum: null,
        },
        flag: null,
        radio: null,
        value: null,
        value1: null,
        starShopSpecs: [
          {name: '', price: ""}
        ],
        cropper: '',
        croppable: false,
        panel: false,
        url: '',
        fileName: '',
        dialogVisible: false,
        dialogVisible1: false,
        // 裁剪组件的基础配置option
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'png', // 裁剪生成图片的格式
          canScale: false, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          // autoCropWidth: 300, // 默认生成截图框宽度
          // autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [2.51, 1], // 截图框的宽高比例
          fixedNumber1: [1.95, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        picsList: [],  //页面显示的数组
        // 防止重复提交
        loading: false,
      }
    },
    methods: {
      cancel() {
        this.$router.push({path: "/activity/activityIndex"})
      },
      stepOne(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.step = 2;
          } else {
            return false;
          }
        });
      },
      stepTwo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.step = 3;
          } else {
            return false;
          }
        })
      },
      stepThree(formName) {
        if (this.value !== null) {
          this.activity.startTime = new Date(this.value[0]).format(`yyyy-MM-dd hh:mm:ss`)
          this.activity.endTime = new Date(this.value[1]).format(`yyyy-MM-dd hh:mm:ss`)
        } else {
          this.activity.startTime = new Date(this.value1[0]).format(`yyyy-MM-dd hh:mm:ss`)
          this.activity.endTime = new Date(this.value1[1]).format(`yyyy-MM-dd hh:mm:ss`)
        }
        this.step = 4;
      },
      submit() {
        addActivity(this.activity).then(res => {
          if (res.queue.code === 1) {
            this.mess("添加成功", "success")
            this.$router.push({path: "/activity/activityIndex"})
          } else {
            this.mess("添加失败", "warning")
          }
        })

      },
      getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      async change(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.panel = true;
        this.picValue = files[0];
        this.url = this.getObjectURL(this.picValue);
        this.fileName = e.target.files[0].name
        //每次替换图片要重新得到新的url
        if (this.cropper) {
          await this.cropper.replace(this.url);
        }
        this.panel = true;
      },
      crop() {
        this.panel = false;
        var croppedCanvas;
        var roundedCanvas;

        if (!this.croppable) {
          return;
        }
        // Crop
        croppedCanvas = this.cropper.getCroppedCanvas();
        // Round
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);

        this.headerImage = roundedCanvas.toDataURL();
        this.postImg()

      },
      getRoundedCanvas(sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        /*
                context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        */
        context.fillRect(0, 0, width, height)
        context.fill();
        return canvas;
      },
      async postImg(data) {
        //这边写图片的上传
        var formData = new FormData();
        formData.append(
          'file',
          data,
          this.fileName
        )
        await postFile(formData).then(res => {
          if (res.queue.code === 1) {
            this.mess('上传成功', 'success')
            this.activity.url = res.data
            this.dialogVisible = false
            this.loading = false
          }
        }).catch(err => {
          this.loading = false
        })
      },
      // 上传按钮   限制图片大小
      changeUpload(file, fileList) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!')
          return false
        }
        // 上传成功后将图片地址赋值给裁剪框显示图片
        this.$nextTick(() => {
          this.option.img = this.getObjectURL(file.raw);
          this.fileName = file.name
          this.dialogVisible = true
        })
      },
      changeUpload1(file, fileList) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!')
          return false
        }
        // 上传成功后将图片地址赋值给裁剪框显示图片
        this.$nextTick(() => {
          this.option.img = this.getObjectURL(file.raw);
          this.fileName = file.name
          this.dialogVisible1 = true
        })
      },
      // 点击裁剪，这一步是可以拿到处理后的地址
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          this.loading = true
          this.postImg(data)
        })
      },
      finish1() {
        this.$refs.cropper.getCropBlob((data) => {
          this.loading = true
          //这边写图片的上传
          var formData = new FormData();
          formData.append(
            'file',
            data,
            this.fileName
          )
          postFile(formData).then(res => {
            if (res.queue.code === 1) {
              this.mess('上传成功', 'success')
              this.activity.detailsUrl = res.data
              this.dialogVisible1 = false
              this.loading = false
            }
          }).catch(err => {
            this.loading = false
          })
        })
      },
      realTime(e) {

      },
    }
  }
</script>

<style scoped>
  .card-layout {
    margin: 10px 10px;
    width: auto;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 351px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }

  .avatar-uploader-icon1 {
    font-size: 28px;
    color: #8c939d;
    width: 351px;
    height: 170px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 351px;
    height: 140px;
    display: block;
  }

  .avatar1 {
    width: 351px;
    height: 180px;
    display: block;
  }

  .form-layout {
    margin-top: 5%;
    width: 48%!important;
  }

  .cropper-content .cropper {
    width: auto;
    height: 400px;
  }
</style>
<style scoped>
  .activity {
    width: 375px;
    margin-top: 30px;
    margin-bottom: 20px;
    padding: 10px;
  }

  .activity .item {
    padding: 10px 0px;
    text-align: left;
  }

  .activity .item .h {
    margin: 0px;
    padding: 0px;
    font-weight: 600;
    line-height: 1.2;
  }

  .activity .item-font {
    text-align: left;
  }

  .activity .item-font .font-item {
    margin: 10px 0;
  }

  .activity .item-font .font-item .font-mess {
    font-size: 12px;
    color: #999999;
  }

  .activity .item-font .font-item .font-mess .right {
    margin-left: 10px;
  }

  .activity .item-span {
    padding: 10px 0px;
  }

  .activity .item-span .note-left {
    float: left;
  }

  .activity .item-span .note-left .font-layout {
    margin-top: 2.5px;
    width: 70px;
    height: 18px;
    font-size: 12px;
    color: #999999;
    line-height: 12px;
    text-align: center;
  }

  .activity .item-span .note-left .header-line-layout {
    display: inline-block;
    width: 5px;
    height: 16px;
    vertical-align: middle;
    position: relative;
    border-radius: 5px;
    line-height: 1.4px;
    background: #F64045;
    border: 1px solid #F64045;
    float: left;
  }

  .activity .item-content {
    margin-top: 12px;
    height: 300px;
    overflow-x: hidden;
  }
</style>
