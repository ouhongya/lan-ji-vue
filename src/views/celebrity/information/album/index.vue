<template>
  <div>
    <div style="min-height: 8px"/>
    <el-card class="form-layout" style="width: 99%;">
      <el-row :gutter="10">
        <el-col :span="3">
          <el-image
            style="width: 130px; height: 180px;"
            :src="bigStar.avatar"
            :preview-src-list="[bigStar.avatar]">
          </el-image>
        </el-col>
        <el-col :span="21">
          <el-form label-width="50px">
            <el-form-item label="姓名:">
              <h4 style="margin: 0px;padding: 0px">{{bigStar.name}}</h4>
            </el-form-item>
            <el-form-item label="简介:">
              {{bigStar.introduce}}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <hr/>
      <el-row :gutter="10">
        <el-col :span="16">
          <h5 style="padding: 0px;margin: 0px;color: #606266">相册预览:</h5>
        </el-col>
        <el-col :span="8">
          <el-col :span="20">
            <h5 style="padding: 0px;margin: 0px;color: #606266">相册上传:</h5>
          </el-col>
          <el-col :span="4">
            <el-button v-if="flag===true" round type="text" size="small" style="float: right;margin: 0px;padding: 0px"
                       @click="submit"><h3
              style="padding: 0px;margin: 0px;">提交</h3></el-button>
            <el-button v-if="flag===false" round type="text" size="small" style="float: right;margin: 0px;padding: 0px"
                       @click="submit"><h3
              style="padding: 0px;margin: 0px;">提交</h3></el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="padding-top: 8px">
        <el-col :span="16" align="center" style="margin-top: 60px">
          <el-carousel :interval="4000" type="card" height="300px" width="300px">
            <el-carousel-item v-for="item in urlList" :key="item.id">
              <img
                :src="item.url"
                width="100%" height="100%"/>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="8" align="center" style="height: 400px;overflow-x: auto">
          <el-upload
            class="upload-demo"
            action=""
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-change="changeUpload"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {postFile} from '@/api/file'
  import Cropper from 'cropperjs'
  import {
    addBigStarAlbum,
    findBigStarById,
    findBigStarAlbum,
    deleteBigStarAlbum
  } from '@/api/celebrity/index'

  export default {
    name: "index",
    data() {
      return {
        urlList: [],
        fileList: [],
        id: null,
        bigStar: {
          avatar: '',
          name: '',
          introduce: ''
        },
        flag: null,
        url: '',
        fileName: '',
        dialogVisible: false,
        // 裁剪组件的基础配置option
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'png', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          //autoCropWidth: 160, // 默认生成截图框宽度
          //autoCropHeight: 160, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: false, // 截图框是否被限制在图片里面
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
      this.image();
    },
    methods: {
      handleRemove(file, fileList) {
        if (file.response === undefined) {
          this.urlList.forEach(item => {
            if (item.url === file.url) {
              deleteBigStarAlbum(item.id).then(res => {
                if (res.queue.code === 1) {
                  this.mess('删除成功', 'success')
                }
              })
            }
          })
          this.urlList = this.urlList.filter(item => item.url !== file.url)
        } else {
          this.urlList = this.urlList.filter(item => item.url !== file.response.data)
        }
      },
      beforeRemoveFile(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      submit() {
        if (this.flag) {
          this.$router.push({path: '/celebrity/information'})
        } else {
          let bigStarAlbum = []
          this.urlList.forEach((item, index) => {
            let obj = {
              url: item.url,
              urlSort: index
            }
            bigStarAlbum.push(obj)
          })
          addBigStarAlbum(this.id, bigStarAlbum).then(res => {
            if (res.queue.code === 1) {
              this.mess('添加成功', 'success');
              this.$router.push({path: '/celebrity/information'})
            }
          })
        }
      },
      image() {
        //初始化这个裁剪框
        var self = this;
        this.cropper = new Cropper(self.$refs.image, {
          aspectRatio: 1 / 1,
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
          zoomOnWheel: false,
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
            if (this.flag === true) {
              let bigStarAlbum = [
                {
                  url: res.data,
                  urlSort: 2
                }
              ]
              addBigStarAlbum(this.id, bigStarAlbum)
            }
            this.mess('上传成功', 'success')
            let obj = {
              url: res.data,
              name: res.data
            }
            this.fileList.push(obj)
            this.urlList.push(obj)
            this.url = res.data
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
    },
    created() {
      this.id = this.$route.query.id
      findBigStarById(this.id).then(res => {
        if (res.queue.code === 1) {
          this.bigStar = res.data
        }
      })
      findBigStarAlbum(this.id).then(res => {
        if (res.queue.code === 1) {
          if (res.data.length === 0) {
            this.flag = false;
          } else {
            this.flag = true;
            let data = res.data
            data.forEach(item => {
              let obj = {
                url: item.url,
                name: item.url
              }
              let c = {
                id: item.id,
                url: item.url
              }
              this.fileList.push(obj)
              this.urlList.push(c)
            })
          }
        }
      })
    }
  }
</script>

<style scoped>
  .cropper-content .cropper {
    width: 400px;
    height: 400px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-image__error, .el-image__inner, .el-image__placeholder {
    height: 200px;
  }
</style>
