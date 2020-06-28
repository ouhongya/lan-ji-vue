<template>
  <el-card class="card-layout" align="center">
    <el-form ref="bigStar" :model="bigStar" class="form-layout" label-width="80px">
      <el-form-item label="头像:">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change="changeUpload">
          <img v-if="bigStar.avatar" :src="bigStar.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" style="padding-top: 74px"></i>
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
      <el-form-item label="名称:" prop="name"
                    :rules="[
           { required: true, message: '请输入大咖名称', trigger: 'blur' }]
       ">
        <el-input v-model="bigStar.name" type="text" maxlength="10" show-word-limit placeholder="请输入大咖名称"></el-input>
      </el-form-item>
      <el-form-item label="简介:" prop="introduce"
                    :rules="[
           { required: true, message: '请输入大咖简介', trigger: 'blur' }]
       ">
        <el-input v-model="bigStar.introduce" type="textarea" maxlength="500" show-word-limit placeholder="请输入大咖简介"
                  :rows="20"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" round @click="cancel">取消</el-button>
        <el-button type="primary" size="small" round @click="submit(`bigStar`)">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {addBigStar} from '@/api/celebrity/index'
  import {postFile} from '@/api/file'
  import Cropper from 'cropperjs'

  export default {
    name: "index",
    data() {
      return {
        bigStar: {
          avatar: '',
          name: '',
          introduce: ''
        },
        fileName: '',
        dialogVisible: false,
        // 裁剪组件的基础配置option
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'png', // 裁剪生成图片的格式
          canScale: false, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          //autoCropWidth: 160, // 默认生成截图框宽度
          //autoCropHeight: 160, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1.4], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        picsList: [],  //页面显示的数组
        // 防止重复提交
        loading: false,
        urlAddress: '',
        cropper: '',
        croppable: false,
        panel: false,
      }
    },
    mounted() {
      this.image()
    },
    methods: {
      cancel() {
        this.$router.push({path: '/celebrity/information'})
      },
      submit(bigStar) {
        this.$refs[bigStar].validate((value) => {
          if (value) {
            addBigStar(this.bigStar).then(res => {
              if (res.queue.code === 1) {
                this.mess('添加成功', 'success')
                this.$router.push({path: '/celebrity/information'})
              }
            })
          } else {
            return false;
          }
        })
      },
      image() {
        //初始化这个裁剪框
        var self = this;
        this.cropper = new Cropper(self.$refs.image, {
          aspectRatio: 1 / 1.4,
          viewMode: 1,
          background: false,
          zoomable: false,
          ready: function () {
            self.croppable = true;
          },
          dragMode: 'none',
          initialAspectRatio: 1,
          preview: '.before',
          autoCropArea: 0.6,
          zoomOnWheel: true,
          checkCrossOrigin: true
        });
      },
      postImg(data) {
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
            this.bigStar.avatar = res.data
            this.dialogVisible = false
            this.loading = false
          }
        }).catch(err => {
          this.dialogVisible = false
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
      // 点击裁剪，这一步是可以拿到处理后的地址
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          this.postImg(data)
          this.loading = true
        })
      },
      realTime(e) {

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
    }
  }
</script>
<style>
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
    width: 150px;
    height: 210px;
    line-height: 210px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 210px;
    display: block;
  }

  .cropper-content .cropper {
    width: auto;
    height: 300px;
  }
</style>
