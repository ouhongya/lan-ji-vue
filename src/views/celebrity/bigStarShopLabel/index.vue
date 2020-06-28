<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" v-if="hasPerm(`big:add`)" size="small" class="el-icon-plus" style="float: right" round
                 @click="Visible=true">添加分类
      </el-button>
      <el-input style="width: 250px" prefix-icon="el-icon-search" size="small" type="text" maxlength="10"
                show-word-limit v-model="search" placeholder="请输入搜索内容"
                clearable/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchData"
      >
        <el-table-column
          prop="createdTime"
          label="日期"
          sortable
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="分类名"
          sortable
        >
          <template slot-scope="props">
            <el-tag
              close-transition
            >{{ props.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="primary" v-if="hasPerm(`big:edit`)" size="small" class="el-icon-edit" round
                       @click="updateTag(props.row.id)">修改
            </el-button>
            <el-button class="el-icon-delete" v-if="hasPerm(`big:dele`)" type="danger" round size="small"
                       @click="deleteTag(props.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        style="text-align: center"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tag" ref="tag" label-width="60px" style="margin:0% 15%">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="tag.name" size="small" style="width: 100%;" placeholder="请输入标分类" type="text" maxlength="10"
                    show-word-limit/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="QX(`tag`)">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmit(`tag`)">确认</el-button>
    </el-dialog>
    <el-dialog
      title="修改分类"
      :visible.sync="VisibleEdit"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tagEdit" ref="tagEdit" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="tagEdit.name" size="small" style="width: 100%;" placeholder="请输入标分类" type="text"
                    maxlength="10"
                    show-word-limit/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="tagEdit.name='',VisibleEdit=false">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmitEdit(`tagEdit`)">确认</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchDataPage, addTag, editTag, deleTag} from '@/api/celebrity/label'

  export default {
    name: 'index',
    data() {
      return {
        list: [],
        currentPage: 1,
        size: 10,
        total: 0,
        search: '',
        Visible: false,
        VisibleEdit: false,
        tag: {
          name: ''
        },
        tagEdit: {
          id: '',
          name: ''
        }
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'bsc.created_time'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'bsc.created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'bsc.created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'created_time'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `name`) {
          if (val.order === undefined) {
            name = 'name'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'name'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'name'
            sort = 'asc'
          }
        }
        fetchDataPage(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      deleteTag(id) {
        this.$confirm('是否删除此分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleTag(id).then(res => {
            if (res.queue.code === 1) {
              this.mess(`删除成功`, 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      updateTag(id) {
        this.list.forEach(item => {
          if (item.id === id) {
            this.tagEdit.id = item.id
            this.tagEdit.name = item.name
          }
        })
        this.VisibleEdit = true
      },
      onSubmit(tag) {
        this.$refs[tag].validate((valid) => {
          if (valid) {
            let formData = new FormData;
            formData.append(`name`, this.tag.name)
            addTag(formData).then(res => {
              if (res.queue.code === 1) {
                this.mess('添加成功', 'success')
                this.tag.name = ''
                this.Visible = false
                this.fetchData()
              }
            })
          } else {
            return false;
          }
        })

      },
      onSubmitEdit(tagEdit) {
        this.$refs[tagEdit].validate((valid) => {
          if (valid) {
            var formdata = new FormData();
            formdata.append('id', this.tagEdit.id)
            formdata.append('name', this.tagEdit.name)
            editTag(formdata).then(res => {
              this.fetchData()
              this.mess('修改成功', 'success')
              this.VisibleEdit = false;
              this.tagEdit.id = ''
              this.tagEdit.name = ''
            })
          }
        })
      },
      QX(tag) {
        this.$refs[tag].resetFields()
        this.tag.name = '',
          this.Visible = false
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'name'
          fetchDataPage(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      }
    },
  }
</script>

<style scoped>
  .card-layout {
    margin: 8px;
  }

  .el-card__body {
    padding: 8px;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #303133;
    font-family: Avenir;
    font-weight: bold;
  }

</style>
