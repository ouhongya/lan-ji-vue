<template>
  <el-card class="card-layout">
    <el-steps :active="count" align-center>
      <el-step title="基本信息"/>
      <el-step title="内容编辑"/>
      <el-step title="备注信息"/>
      <el-step title="时间选择"/>
      <el-step title="完成"/>
    </el-steps>
    <el-row>
      <el-col :span="24" v-if="count===1">
        <br/>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px"
                 style="margin: 0% 34%">
          <el-form-item label="展览缩略图:" prop="fileList">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :on-change='changeUpload'>
              <img v-if="url" :src="url" class="avatar">
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
          <el-form-item label="展览标题:" prop="name">
            <el-input v-model="form.name" type="text" size="small" maxlength="50" show-word-limit
                      placeholder="请输入展览标题"/>
          </el-form-item>
          <el-form-item label="选择展馆:" prop="exhibition">
            <el-select v-model="form.exhibition" style="width: 100%;" placeholder="请选择" size="small">
              <el-option
                v-for="(item,index) in exhibitions"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="展览类型:" prop="value">
            <el-select v-model="form.value" style="width: 100%;" size="small" placeholder="请选择">
              <el-option
                v-for="(item,index) in options"
                :key="index+1"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="展览标签:" prop="tags">
            <el-select v-model="form.tags" style="width: 100%;" size="small" multiple placeholder="请选择">
              <el-option
                v-for="item in tagOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" v-show="count===2" align="center">
        <br/>
        <tinymce v-model="editorContent" :height="500" style="width: 350px"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" v-show="count===3" align="center">
        <br/>
        <tinymce v-model="farm.way" :height="500" style="width: 340px"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" v-show="count===4">
        <br/>
        <el-form :model="farm" label-width="120px" ref="farm" :rules="rulesTime"
                 style="margin: 0% 30%">
          <el-form-item label="是否收费:" prop="resource">
            <el-radio-group v-model="farm.resource" size="small">
              <el-radio border :label="0">免费</el-radio>
              <el-radio border :label="1">收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收费标准:" prop="price" v-show="farm.resource===1">
            <el-input v-model="farm.price" type="text" size="small" maxlength="20" show-word-limit style="width: 100%"
                      placeholder="请输入收费标准"/>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input placeholder="请输入详细地址" v-model="farm.address" type="text" size="small" maxlength="20"
                      show-word-limit style="width: 100%">
              <template slot="prepend">{{urlAddress}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="展览介绍:" prop="address">
            <el-input v-model="farm.intro" type="textarea" size="small" maxlength="50" show-word-limit :rows="5"
                      style="width: 100%"
                      placeholder="请输入一段简短的展览介绍"/>
          </el-form-item>
          <el-form-item label="展览开始时间:" prop="startTime">
            <el-date-picker
              size="small"
              style="width:100%"
              v-model="farm.startTime"
              type="date"
              placeholder="选择展览开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="展览结束时间:" prop="endTime">
            <el-date-picker
              size="small"
              style="width:100%"
              v-model="farm.endTime"
              type="date"
              placeholder="选择展览结束时间"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" v-if="count===5" align="center">
        <br/>
        <el-card class="box-card-component" shadow="hover" style="margin:8px;">
          <div class="exhibition-layout">
            <div class="header-layout">
              <el-row :gutter="24">
                <el-col :span="7">
                  <div class="img-layout">
                    <img :src="form.fileList[0].url" height="130px" width="90px"/>
                  </div>
                </el-col>
                <el-col :span="17">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      <div class="div-title-layout" style="margin-top: 2px;text-align: left">{{form.name.length>=22?form.name.substr(0,22)+'......':form.name}}</div>
                    </el-col>
                    <el-col :span="24">
                      <div class="el-icon-timer div-icon-layout">
                      </div>
                      <div class="div-time-layout">{{farm.startTime.substr(0,10)}} - {{farm.endTime.substr(0,10)}}</div>
                    </el-col>
                    <el-col :span="24">
                      <div style="margin-top: 8px">
                        <div class="el-icon-money div-icon-layout">
                        </div>
                        <div class="div-time-layout">{{farm.price===0?'免费':farm.price}}</div>
                      </div>
                    </el-col>
                    <el-col :span="24">
                      <div style="margin-top: 8px;margin-left: 18px;margin-right: 18px">
                        <el-button type="danger" size="small" style="float: left">查看召集</el-button>
                        <el-button type="warning" size="small" style="float: right">发起召集</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="address-layout">
              <div class="div-location-to">
                <div class="el-icon-map-location" style="float: left;margin: 0 8px;margin-top: 1px;"></div>
                <div class="div-localhost">
                  <div class="div-mess-location">
                    {{urlAddress}}{{farm.address}}
                  </div>
                </div>
              </div>
            </div>
            <div class="note-layout">
              <div class="note-left">
                <div class="header-line-layout"
                     style="background:rgba(140,228,135,1);;border: rgba(140,228,135,1) "></div>
                <div class="font-layout">备注</div>
              </div>
            </div>
            <div class="div-html" style="width: 330px;height: 100px;overflow-x: hidden;">
              <code v-html="farm.way"/>
            </div>
            <div class="note-layout">
              <div class="note-left">
                <div class="header-line-layout"></div>
                <div class="font-layout">详情介绍</div>
              </div>
            </div>
            <div class="div-html" style="width: 300px;height: 300px;overflow-x: hidden;">
              <code v-html="editorContent"/>
            </div>
            <div class="note-layout">
              <div class="note-left">
                <div class="header-line-layout" style="background:rgba(250,103,106,1);border:rgba(250,103,106,1)"></div>
                <div class="font-layout">温馨提示</div>
              </div>
            </div>
            <div class="div-font">
              1.览集平台的召集信息由召集方用户自行发布，仅代表其个人行为，与览集所有方无关。<br/>
              2.活动由召集方独立安排负责后续事项。<br/>
              3.览集所有方仅提供信息展示平台。<br/>
              4.不能保证召集的真实性、有效性、安全性。<br/>
              5.请参加活动的用户主意人生财产安全。<br/>
            </div>
            <div></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" align="center" style="padding-top: 20px">
        <el-button type="primary" size="small" round v-if="count===1" @click="cancelReturn"><i
          class="el-icon-close"/>&nbsp;&nbsp;取消
        </el-button>
        <el-button type="primary" size="small" round v-if="count>1" icon="el-icon-arrow-left" @click="cancel">
          上一步
        </el-button>
        <el-button type="primary" size="small" round v-if="count===1" @click="next(`form`)">下一步<i
          class="el-icon-arrow-right el-icon--right"/></el-button>
        <el-button type="primary" size="small" round v-if="count===2" @click="nextUser">下一步<i
          class="el-icon-arrow-right el-icon--right"/></el-button>
        <el-button type="primary" size="small" round v-if="count===3" @click="nextUser">下一步<i
          class="el-icon-arrow-right el-icon--right"/></el-button>
        <el-button type="primary" size="small" round v-if="count===4" @click="nextThree(`farm`)">下一步<i
          class="el-icon-arrow-right el-icon--right"/></el-button>
        <el-button type="primary" size="small" round v-if="count===5" @click="nextSubmit(`user`)">完成&nbsp;&nbsp;<i
          class="el-icon-arrow-right el-icon-check"/></el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  import {addExhibition1, tagList, exhibitionHallList} from '@/api/exhibition/index'
  import {postFile} from '@/api/file'
  import {optionList} from '@/utils/Global'
  import Cropper from 'cropperjs'
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'index',
    data() {
      let fileList = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请上传一张封面图'))
        } else {
          callback()
        }
      }
      let name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入展览名称'))
        } else {
          callback()
        }
      }
      let exhibition = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择一个选择展馆'))
        } else {
          callback()
        }
      }
      let value = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择一个展览类型'))
        } else {
          callback()
        }
      }
      let tags = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('最少选择一个标签'))
        } else {
          callback()
        }
      }
      let way = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入该展览的报名方式'))
        } else {
          callback()
        }
      }
      let address = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入该展览的详细地址'))
        } else {
          callback()
        }
      }
      let endTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择该展览的结束时间'))
        } else {
          callback()
        }
      }
      let startTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择该展览的开始时间'))
        } else {
          callback()
        }
      }
      return {
        editor: null,
        editorContent: '',
        form: {
          name: '',
          fileList: [],
          exhibition: null,
          value: null,
          tags: null,
        },
        farm: {
          way: '',
          price: '',
          address: "",
          startTime: '',
          endTime: '',
          resource: '',
          intro: ''
        },
        count: 1,
        tagOptions: null,
        options: optionList,
        exhibitions: null,
        rules: {
          fileList: [{validator: fileList, required: true, trigger: 'change'}],
          name: [{validator: name, trigger: 'blur'}],
          exhibition: [{validator: exhibition, required: true, trigger: 'change'}],
          value: [{validator: value, required: true, trigger: 'change'}],
          tags: [{validator: tags, required: true, trigger: 'change'}],
        },
        rulesTime: {
           way: [{validator: way, trigger: 'blur'}],
           /*address: [{validator: address, trigger: 'blur'}],*/
           startTime: [{validator: startTime, required: true, trigger: 'change'}],
           endTime: [{validator: endTime, required: true, trigger: 'change'}],
        },
        headerImage: '',
        picValue: '',
        cropper: '',
        croppable: false,
        panel: false,
        url: '',
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
          // autoCropWidth: 300, // 默认生成截图框宽度
          // autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: true, // 固定截图框大小 不允许改变
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
        urlAddress: ''
      }
    },
    components: {
      Tinymce,
    },
    methods: {
      cancel() {
        this.count--
      },
      cancelReturn() {
        this.$router.push({path: '/gather/exhibition'})
      },
      next(form) {
        let _this = this
        this.$refs[form].validate((valid) => {
          if (valid) {
            _this.count++;
          }
        })
      },
      nextThree(farm) {
        let _this = this
        this.$refs[farm].validate((valid) => {
          if (valid) {
            this.farm.startTime = new Date(this.farm.startTime).format(`yyyy-mm-dd hh:MM:ss`)
            this.farm.endTime = new Date(this.farm.endTime).format(`yyyy-mm-dd hh:MM:ss`)
            _this.count = 5;
          }
        })
      },
      nextSubmit(user) {
        if (this.farm.price === `` || this.farm.price === undefined) {
          this.farm.price = `0`
        }
        let obj = {
          address: this.farm.address,
          avatar: this.form.fileList[0].url,
          details: this.editorContent,
          endTime: this.farm.endTime,
          startTime: this.farm.startTime,
          exhibitionHallId: this.form.exhibition,
          exhibitionType: this.form.value,
          name: this.form.name,
          tags: this.form.tags,
          signUpWay: this.farm.way,
          expenses: this.farm.price,
          intro: this.farm.intro,
        }
        addExhibition1(obj).then(res => {
          if (res.queue.code === 1) {
            this.mess('添加成功', 'success');
            this.$router.push({path: '/gather/exhibition'})
          }
        })
      },
      nextUser() {
        this.exhibitions.forEach(item => {
          if (item.id === this.form.exhibition) {
            this.urlAddress = item.address
          }
        })
        this.count++
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
          zoomOnWheel: false,
          checkCrossOrigin: true
        });
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
            let obj = {
              url: res.data,
              name: res.data
            }
            this.form.fileList.push(obj)
            this.url = res.data
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
        this.fileinfo = file
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
          this.loading = true
          this.postImg(data)
        })
      },
      realTime(e) {

      },
    },
    created() {
      tagList().then(res => {
        if (res.queue.code === 1) {
          this.tagOptions = res.data.list
        }
      })
      exhibitionHallList().then(res => {
        if (res.queue.code === 1) {
          this.exhibitions = res.data.list
        }
      })
    },
  }
</script>
<style lang="scss">
  .box-card-component {
    .el-card__body {
      padding: 0px !important;
    }
  }
</style>
<style scoped>
  .box-card-component {
    width: 330px;
  }

  .cropper-content .cropper {
    width: auto;
    height: 300px;
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
    width: 143px;
    height: 200px;
    text-align: center;
    line-height: 6.5;
  }

  .avatar {
    width: 143px;
    height: 200px;
    display: block;
  }

  .exhibition-layout {
    width: 320px;
    margin: 0 4px;
  }

  .header-layout {
    width: 100%;
    height: 140px;
  }

  .address-layout {
    width: 100%;
    height: 33px;
  }

  .note-layout {
    height: 33px;
    border: #00a4ff;
  }

  .note-mess-layout {
    width: 100%;
    height: auto;
  }

  .font-layout {
    margin-top: 2px;
    width: 70px;
    height: 18px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 12px;
    text-align: center;
  }

  .Vertical-layout {
    width: 1px;
    border-radius: 0px 20% 0px 20%;
  }

  .header-line-layout {
    display: inline-block;
    width: 5px;
    height: 16px;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
    border-radius: 5px;
    line-height: 1.4px;
    background: rgba(120, 203, 200, 1);
    border: 1px solid rgba(120, 203, 200, 1);
    float: left;
  }

  .note-left {
    width: 60px;
    float: left;
    margin-top: 8px;
  }

  .img-layout {
    margin-bottom: 1px;
    margin: 0 8px;
  }

  .div-title-layout {
    height: 50px;
    margin-left: 18px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
  }

  .div-time-layout {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    float: left;
    margin-top: 3px;
  }

  .div-icon-layout {
    width: 20px;
    size: 20px;
    margin-left: 18px;
    float: left;
  }

  .div-location-to {
    margin-top: 4px;
  }

  .div-mess-location {
    height: 40px;
    width: 100%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 18px;
    text-align: left;
  }

  .div-html {
    width: 330px;
  }
  .div-font{
    line-height: 1.5rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    text-align: left;
  }
</style>
