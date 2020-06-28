<template>
  <el-card class="card-layout">
    <el-form ref="bigStarShop" :model="bigStarShop" label-width="100px" class="form-layout">
      <el-form-item label="商品图片:">
        <el-upload
          action="/server/upload"
          list-type="picture-card"
          :show-file-list="false"
          :on-change="changeUpload">
          <img v-if="bigStarShop.url" :src="bigStarShop.url" class="avatar">
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
      <el-form-item label="详情图:">
        <el-upload
          action="/server/upload"
          list-type="picture-card"
          :on-success="handlePictureCardPreviewDetailSuccess"
          :on-preview="handlePictureCardPreviewDetail"
          :file-list="fileList"
          :before-remove="beforeRemoveFile"
          :limit="1"
          :on-remove="handleRemoveDetail">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisibleDetail">
          <img width="100%" :src="bigStarShop.detailsUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="名称:" prop="name"
                    :rules="[
      { required: true, message: '请输入商品名称'}
    ]">
        <el-input v-model="bigStarShop.name" placeholder="请输入商品名称"/>
      </el-form-item>
      <el-form-item label="描述:"
                    prop="description"
                    :rules="[
      { required: true, message: '请输入商品描述'}
    ]">
        <el-input v-model="bigStarShop.description" type="textarea" :rows="4" placeholder="请输入商品名称"/>
      </el-form-item>
      <el-form-item label="规格:">
        <el-table :data="bigStarShop.starShopSpecs"
                  style="width: 100%" border>
          <el-table-column
            label="数量"
            align="center">
            <template slot-scope="props">
              <el-input v-model="props.row.name" placeholder="请输入数量例如:一个 一包"/>
            </template>
          </el-table-column>
          <el-table-column
            label="单价"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" placeholder="请输入单价"
                        maxlength="8"
                        oninput="value=value.replace(/[^\d.]/g,'')"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="props">
              <el-button type="text" size="small" @click="deleTable(props.$index)">删除</el-button>
              <el-button type="text" size="small" @click="addTable()">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="分类:">
        <el-select v-model="bigStarShop.bigStarShopClassId" style="width: 100%;" placeholder="请选择该商品所属分内">
          <el-option
            v-for="item in optionsListLabel"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" round style="margin-left: 28%" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" round @click="submit(`bigStarShop`)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {
    findAllBigStart,
    updateBigStarShop,
    findBigStarShopClass,
    findBigStarShopById
  } from '@/api/celebrity/BigStarShop'
  import {postFile} from '@/api/file'
  import Cropper from 'cropperjs'

  export default {
    name: "index",
    data() {
      return {
        bigStarShop: {
          id: this.$route.query.id,
          url: null,
          name: null,
          freight: null,
          detailsUrl: null,
          bigStartId: null,
          description: null,
          starShopSpecs: [
            {
              name: 0,
              price: 0
            }
          ],
          bigStarShopClassId: null
        },
        optionsList: null,
        optionsListLabel: null,
        dialogVisible: false,
        dialogVisibleDetail: false,
        fileList: null,
        avatar: null,

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
          fixedNumber: [1, 1], // 截图框的宽高比例
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
    methods: {
      deleTable(index) {
        let table = this.bigStarShop.starShopSpecs
        if (table.length === 1) {
          table.pop()
          table.push({name: 0, price: 0})
        } else {
          table.splice(index, 1)
        }
      },
      addTable() {
        this.bigStarShop.starShopSpecs.push({name: 0, price: 0})
      },
      submit(bigStarShop) {
        this.$refs[bigStarShop].validate(value => {
          if (value) {
            updateBigStarShop(this.bigStarShop).then(res => {
              if (res.queue.code === 1) {
                this.mess('编辑成功', 'success')
                this.$router.push({path: '/celebrity/commodity'})
              }
            })
          } else {
            return false
          }
        })
      },
      handleRemove(file, fileList) {
        this.bigStarShop.url = null
      },
      handlePictureCardPreview(file) {
        this.bigStarShop.url = file.url;
        this.dialogVisible = true;
      },
      handlePictureCardPreviewSuccess(res, file, fileList) {
        if (res.queue.code === 1) {
          this.bigStarShop.url = res.data
        }
      },
      handleRemoveDetail(file, fileList) {
        this.bigStarShop.detailsUrl = null
      },
      handlePictureCardPreviewDetail(file) {
        this.bigStarShop.detailsUrl = file.url;
        console.log(this.bigStarShop.detailsUrl)
        this.dialogVisibleDetail = true;
      },
      handlePictureCardPreviewDetailSuccess(res, file, fileList) {
        if (res.queue.code === 1) {
          this.bigStarShop.detailsUrl = res.data;
        }
      },
      cancel() {
        this.$router.push({path: '/celebrity/commodity'})
      },
      beforeRemoveFile(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
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
            this.bigStarShop.url = res.data
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
      findAllBigStart().then(res => {
        if (res.queue.code === 1) {
          this.optionsList = res.data.list
        }
      })
      findBigStarShopClass().then(res => {
        if (res.queue.code === 1) {
          this.optionsListLabel = res.data.list
        }
      })
      findBigStarShopById(this.$route.query.id).then(res => {
        if (res.queue.code === 1) {
          this.bigStarShop = res.data
          this.fileList = [{name: this.bigStarShop.detailsUrl, url: this.bigStarShop.detailsUrl}]
          this.avatar = [{name: this.bigStarShop.url, url: this.bigStarShop.url}]
        }
      })
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }

  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
