<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small" class="el-icon-plus" style="float: right" round
                 v-if="hasPerm(`pav:add`)"
                 @click="Visible=true">添加展馆
      </el-button>
      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search" clearable
                size="small" v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="createdTime"
          sortable
          label="日期">
          <template slot-scope="props">
            {{props.row.createdTime| dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="name"
          align="center"
          label="展馆名">
        </el-table-column>
        <el-table-column
          prop="address"
          sortable
          align="center"
          label="详细地址">
        </el-table-column>
        <el-table-column
          prop="route"
          sortable
          align="center"
          label="出行方式">
          <template slot-scope="props">
            <el-popover
              placement="top-start"
              :title="props.row.name"
              width="350"
              trigger="hover"
              :content="props.row.route">
              <el-button slot="reference" type="text" v-text="">{{props.row.route.substring(0,15)}}...</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          sortable
          align="center"
          label="关联展览数">
        </el-table-column>
        <el-table-column
          align="center"
          width="200px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" v-if="hasPerm(`pav:edit`)" size="small" round @click="edit(props.row.id)"
                       class="el-icon-edit">编辑
            </el-button>
            <el-button type="danger" v-if="hasPerm(`pav:dele`)&&props.row.num===0" size="small" round
                       @click="strike(props.row.id)" class="el-icon-delete">删除
            </el-button>
            <el-button type="danger" v-if="hasPerm(`pav:dele`)&&props.row.num!==0" disabled size="small" round
                       @click="strike(props.row.id)" class="el-icon-delete">删除
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
      title="添加展馆"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="40%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="pavilion" label-width="90px" ref="pavilion" style="margin:0% 10%">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '展馆名不能为空'}]">
          <el-input v-model="pavilion.name" size="small" type="text" maxlength="20" show-word-limit
                    placeholder="请输入展馆名"/>
        </el-form-item>
        <el-form-item label="区域:" prop="community">
          <el-cascader
            size="small"
            v-model="community"
            :options="option"
            style="width: 100%"
            :props="props"
          />
        </el-form-item>
        <el-form-item label="详细地址:" prop="address" :rules="[{ required: true, message: '请输入详细地址'}]">
          <el-input v-model="pavilion.address" size="small" type="text" maxlength="20" show-word-limit
                    placeholder="请输入详细地址"/>
        </el-form-item>
        <el-form-item label="出行方式:" prop="route" :rules="[{ required: true, message: '请输入如出行方式'}]">
          <el-input v-model="pavilion.route" type="textarea" maxlength="200" show-word-limit :rows="6"
                    placeholder="请输入出行方式"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="cancel(`pavilion`)">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmit(`pavilion`)">确认</el-button>
    </el-dialog>
    <el-dialog
      title="修改展馆"
      :visible.sync="VisibleEdit"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="40%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="pavilionEdit" label-width="100px" ref="pavilionEdit" style="margin:0% 10%">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '展馆名不能为空'}]">
          <el-input v-model="pavilionEdit.name" size="small" type="text" maxlength="20" show-word-limit placeholder="请输入标签名"/>
        </el-form-item>
        <el-form-item label="区域:">
          <el-cascader
            size="small"
            v-model="community"
            :options="option"
            style="width: 100%"
            :props="props"
          />
        </el-form-item>
        <el-form-item label="详细地址:" prop="address" :rules="[{ required: true, message: '详细地址不能为空'}]">
          <el-input v-model="pavilionEdit.address" size="small" type="text" maxlength="20" show-word-limit placeholder="请输入详细地址"/>
        </el-form-item>
        <el-form-item label="出行方式:" prop="route" :rules="[{ required: true, message: '出行方式不能为空'}]">
          <el-input v-model="pavilionEdit.route" type="textarea" :rows="6" maxlength="200" show-word-limit    placeholder="请输入出行方式"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="cancel1(`pavilionEdit`)">取消
      </el-button>
      <el-button type="primary" size="small" round @click="onSubmitEdit(`pavilionEdit`)">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findAllExhibitionHall,
    addExhibitionHall,
    updateExhibitionHall,
    deleteExhibitionHall
  } from '@/api/gather/pavilion'
  import {findAreaAndCity} from '@/api/gather/index'

  export default {
    name: 'index',
    data() {
      return {
        list: [],
        search: '',
        currentPage: 1,
        total: 0,
        size: 10,
        VisibleEdit: false,
        Visible: false,
        pavilion: {
          name: '',
          address: '',
          route: ''
        },
        pavilionEdit: {
          id: '',
          name: '',
          address: '',
          route: ''
        },
        option: null,
        props: {
          label: 'name',
          value: 'id',
          children: 'areas'
        },
        community: []
      }
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          this.fetchData()
        }
      }
    },
    methods: {
      fetchData(val) {
        let name = 'created_time'
        let sort = 'desc'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'created_time'
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
        if (val !== undefined && val.prop === `address`) {
          if (val.order === undefined) {
            name = 'address'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'address'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'address'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `route`) {
          if (val.order === undefined) {
            name = 'route'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'route'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'route'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `num`) {
          if (val.order === undefined) {
            name = 'num'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'num'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'num'
            sort = 'asc'
          }
        }
        findAllExhibitionHall(this.currentPage, this.search, this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      edit(id) {
        this.list.forEach(item => {
          if (item.id === id) {
            this.pavilionEdit.id = item.id;
            this.pavilionEdit.name = item.name;
            this.pavilionEdit.address = item.address;
            this.pavilionEdit.route = item.route;
            this.option.forEach(key => {
              key.areas.forEach(val => {
                if (val.id === item.areaId) {
                  this.community = [key.id, val.id];
                }
              })
            })
          }
        })
        this.VisibleEdit = true;
      },
      strike(id) {
        this.$confirm('是否删除此展馆?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteExhibitionHall(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      close() {
        this.Visible = false
        this.pavilion.name = ''
        this.pavilion.address = ''
        this.pavilion.route = ''
        this.community = []
        this.VisibleEdit = false
        this.pavilionEdit.id = ''
        this.pavilionEdit.name = ''
        this.pavilionEdit.address = ''
        this.pavilionEdit.route = ''
      },
      onSubmit(pavilion) {
        this.$refs[pavilion].validate((valid) => {
          if (valid) {
            let obj = {
              name: this.pavilion.name,
              areaId: this.community[1],
              address: this.pavilion.address,
              route: this.pavilion.route
            }
            addExhibitionHall(obj).then(res => {
              if (res.queue.code === 1) {
                this.mess('添加成功', 'success')
                this.pavilion.name = ''
                this.pavilion.address = ''
                this.pavilion.route = ''
                this.community = []
                this.Visible = false
                this.fetchData()
              }
            })
          } else {
            return false;
          }
        })
      },
      onSubmitEdit(pavilionEdit) {
        this.$refs[pavilionEdit].validate((valid) => {
          if (valid) {
            let obj = {
              id: this.pavilionEdit.id,
              name: this.pavilionEdit.name,
              areaId: this.community[1],
              address: this.pavilionEdit.address,
              route: this.pavilionEdit.route
            }
            updateExhibitionHall(obj).then(res => {
              if (res.queue.code === 1) {
                this.mess('修改成功', 'success')
                this.VisibleEdit = false
                this.community = []
                this.pavilionEdit.id = ''
                this.pavilionEdit.name = ''
                this.pavilionEdit.address = ''
                this.pavilionEdit.route = ''
                this.fetchData()
              }
            })
          } else {
            return false
          }
        })
      },
      cancel(pavilion) {
        this.$refs[pavilion].resetFields()
        this.Visible = false
        this.pavilion.name = ''
        this.pavilion.address = ''
        this.pavilion.route = ''
        this.community = []
      },
      cancel1(pavilionEdit) {
        this.$refs[pavilionEdit].resetFields()
        this.community = []
        this.VisibleEdit = false
        this.pavilionEdit.id = ''
        this.pavilionEdit.name = ''
        this.pavilionEdit.address = ''
        this.pavilionEdit.route = ''
      }
    },
    created() {
      this.fetchData()
      findAreaAndCity().then(res => {
        this.option = res.data
      })
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
