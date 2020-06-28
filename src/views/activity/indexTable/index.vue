<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small"v-if="hasPerm(`act:add`)"  class="el-icon-plus" style="float: right" round @click="addInformation">
        添加活动
      </el-button>
      <el-input style="width: 300px" prefix-icon="el-icon-search" size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form class="from-a" label-width="110px">
                  <el-form-item label="活动名称:">
                    <span>{{props.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="活动地址:">
                    <span v-html="props.row.address"></span>
                  </el-form-item>
                  <el-form-item label="活动封面图:">
                    <img :src="props.row.url" width="100px" height="50"/>
                  </el-form-item>
                  <el-form-item label="活动主办方:">
                    <div>{{props.row.main}}</div>
                  </el-form-item>
                  <el-form-item label="活动开始时间:">
                    <span>{{ props.row.startTime |dateformat(`YYYY-MM-HH hh:mm`)}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form class="from-a" label-width="110px">
                  <el-form-item label="活动单价:">
                    <span>{{props.row.price}}元/{{props.row.spec}}人</span>
                  </el-form-item>
                  <el-form-item label="活动状态:">
                    <span>{{props.row.state===1?"上架中":"已下架"}}</span>
                  </el-form-item>
                  <el-form-item label="活动详情图:">
                    <img :src="props.row.detailsUrl" width="100px" height="50"/>
                  </el-form-item>
                  <el-form-item label="活动合作方:">
                    <div>{{props.row.cooperate}}</div>
                  </el-form-item>
                  <el-form-item label="活动结束时间:">
                    <span>{{ props.row.endTime |dateformat(`YYYY-MM-HH hh:mm`)}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="日期"
          align="center">
          <template slot-scope="props">
            {{props.row.createdTime|dateformat(`YYYY-MM-DD HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="url"
          label="详情图"
          align="center">
          <template slot-scope="props">
            <el-image
              style="width: 100px; height: 60px"
              :src="props.row.url"
              :preview-src-list="[props.row.url]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="状态">
          <template slot-scope="props">
            <el-button type="text" @click="down(props.row.id,props.row.state)">{{props.row.state===1?"上架中":"已下架"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm(`act:edit`)"  round @click="editInformation(props.row.id)">编辑</el-button>
            <el-button type="danger" size="small" v-if="props.row.state===1 && hasPerm(`act:dele`)" disabled round
                       @click="deleInformation(props.row.id)">删除
            </el-button>
            <el-button type="danger" size="small" v-if="props.row.state!==1 && hasPerm(`act:dele`)" round
                       @click="deleInformation(props.row.id)">删除
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
  </div>
</template>

<script>
  import {findAllActivity, deleteActivity, activityUpDown} from "@/api/activity/index"

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
      }
    },
    methods: {
      fetchData() {
        let sort = 'desc'
        let name = 'bsc.created_time'
        /*if (val !== undefined && val.prop === `createdTime`) {
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
        }*/
        findAllActivity(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list;
            this.total = res.data.total
          }
        })
      },
      addInformation() {
        this.$router.push({path: '/activity/addActivity'})
      },
      editInformation(id) {
        this.$router.push({path: '/activity/editActivity', query: {id: id}})
      },
      deleInformation(id) {
        this.$confirm('是否删除此活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteActivity(id).then(res => {
            if (res.queue.code === 1) {
              this.mess("删除成功", "success")
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      down(id, state) {
        if (state === 1) {
          this.$confirm('您是否下架此活动?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            activityUpDown(id).then(res => {
              if (res.queue.code === 1) {
                this.mess("下架成功", "success")
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        }
        if (state !== 1) {
          this.$confirm('您是否上架此活动?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            activityUpDown(id).then(res => {
              if (res.queue.code === 1) {
                this.mess("上架成功", "success")
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        }
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
          let name = 'bsc.created_time'
          /*if (val !== undefined && val.prop === `createdTime`) {
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
          }*/
          findAllActivity(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
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

  .from-a label {
    width: 90px;
    color: #99a9bf;
  }
</style>
