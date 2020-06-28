<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" v-if="hasPerm(`exh:add`)" size="small" class="el-icon-plus" style="float: right" round
                 @click="addExhibition">
        添加展览
      </el-button>
      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        :default-sort="{prop: 'created_time', order: 'descending'}"
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" label-width="110px">
              <el-form-item label="标签集:">
                <div class="tag-group" v-if="props.row.tagList!==''">
                  <el-tag
                    v-for="(tag,index) in props.row.tagList"
                    :key="index"
                    type="primary">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
              <el-form-item label="展览类型:">
                <span>{{props.row.exhibitionName}}</span>
              </el-form-item>
              <el-form-item label="备注:">
                <span v-html="props.row.signUpWay"></span>
              </el-form-item>
              <el-form-item label="展览介绍:">
                <span v-html="props.row.intro"></span>
              </el-form-item>
              <el-form-item label="展览开始时间:">
                <span>{{ props.row.startTime |dateformat(`YYYY-MM-HH hh:mm`)}}</span>
              </el-form-item>
              <el-form-item label="展览结束时间:">
                <span>{{ props.row.endTime |dateformat(`YYYY-MM-HH hh:mm`)}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          align="center"
          width="140px"
          sortable
          label="日期">
          <template slot-scope="props">
            {{props.row.createdTime | dateformat(`YYYY-MM-HH hh:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          sortable
          label="展览名称">
        </el-table-column>
        <el-table-column
          align="center"
          label="展览封面">
          <template slot-scope="props">
            <el-image
              style="width: 80px; height: 112px"
              :src="props.row.avatar"
              :preview-src-list="props.row.src">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          sortable
          label="展览状态">
          <template slot-scope="props">
            <p>{{props.row.status===0?'已下架':'展览中'}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="hallName"
          align="center"
          sortable
          label="展馆名称">
        </el-table-column>
        <el-table-column
          align="center"
          width="400px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" round v-if="props.row.status===0&&hasPerm(`exh:updo`)"
                       @click="on(props.row.id,1)">上架
            </el-button>
            <el-button type="primary" size="small" round v-if="props.row.status===1&&hasPerm(`exh:updo`)"
                       @click="under(props.row.id,0)">下架
            </el-button>
            <el-button type="primary" size="small" v-if="hasPerm(`exh:zhaoj`)" round @click="viewConvene(props.row.id,props.row.name)">查看召集
            </el-button>
            <el-button type="primary" size="small" v-if="hasPerm(`exh:edit`)" round
                       @click="editExhibition(props.row.id)">编辑
            </el-button>
            <el-button type="primary" size="small" v-if="hasPerm(`exh:view`)" round @click="view(props.row.id)">查看
            </el-button>
            <el-button type="danger" size="small" v-if="hasPerm(`exh:dele`)" round @click="strike(props.row.id)">删除
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
      <el-dialog
        :title="title"
        :visible.sync="Visible"
        :close-on-click-modal="false"
        custom-class="customWidth"
        width="370px"
        :close-on-press-escape="false"
        show-clos="false"
        class="dialog-layout"
      >
        <div style="border: 1px solid red">
          <div v-html="content"/>
        </div>
        <el-button type="primary" size="small" round @click="content=null,title=null,Visible=false">取消</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {fetchData, deleteExhibition, exhibitionUpDown, findExhibitionDetails} from '@/api/exhibition/index'

  export default {
    name: 'index',
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        content: null,
        title: null,
        Visible: false
      }
    },
    methods: {
      fetchData(val) {
        let name = 'name'
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
        if (val !== undefined && val.prop === `status`) {
          if (val.order === undefined) {
            name = 'status'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'status'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'status'
            sort = 'asc'
          }
        }
        fetchData(this.currentPage, '', this.size, name, sort, '').then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list;
            this.list.forEach(item => {
              let arr = []
              arr.push(item.avatar)
              item.src = arr
              if (item.exhibitionType === 1) {
                item.exhibitionName = `展览`
              }
              if (item.exhibitionType === 2) {
                item.exhibitionName = `讲座`
              }
              if (item.exhibitionType === 3) {
                item.exhibitionName = `书友会`
              }
            })
            this.total = res.data.total
          }
        })
      },
      addExhibition() {
        this.$router.push({path: '/gather/addExhibition'})
      },
      editExhibition(id) {
        this.$router.push({path: '/gather/editExhibition', query: {id: id}})
      },
      strike(id) {
        this.$confirm('是否删除此展览?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteExhibition(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      under(id, status) {
        this.$confirm('是否下架此展览?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exhibitionUpDown(id, status).then(res => {
            if (res.queue.code === 1) {
              this.mess('下架成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      on(id, status) {
        this.$confirm('是否上架此展览?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exhibitionUpDown(id, status).then(res => {
            if (res.queue.code === 1) {
              this.mess('上架成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      view(id) {
        findExhibitionDetails(id).then(res => {
          if (res.queue.code === 1) {
            this.content = res.data
            this.Visible = true;
          }
        })
        this.list.forEach(item => {
          if (item.id === id) {
            this.title = item.name
          }
        })
      },
      viewConvene(id, name) {
        this.$router.push({path: '/gather/exhibitionView', query: {id: id, name: name}})
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
          fetchData(this.currentPage, search, this.size, name, sort, '').then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
              this.list.forEach(item => {
                let arr = []
                arr.push(item.avatar)
                item.src = arr
              })
              this.total = res.data.total
            }
          })
        }
      }
    }

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

  demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .dialog-layout .el-dialog__body {
    padding: 0px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    border: 1px solid red;
  }
</style>
<style>

</style>
