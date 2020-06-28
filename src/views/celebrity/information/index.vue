<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" v-if="hasPerm(`cel:add`)" size="small" class="el-icon-plus" style="float: right" round
                 @click="addInformation">
        添加大咖
      </el-button>
      <el-input style="width: 250px" prefix-icon="el-icon-search" type="text" maxlength="10" show-word-limit
                size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        :default-sort="{prop: 'ssort', order: 'descending'}"
        fit
        highlight-current-row
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column
          prop="createdTime"
          sortable
          align="center"
          label="日期">
          <template slot-scope="props">
            {{props.row.createdTime|dateformat(`YYYY-MM-DD hh:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="图片">
          <template slot-scope="props">
            <el-image
              style="width: 80px;height: 112px"
              :src="props.row.avatar"
              :preview-src-list="[props.row.avatar]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          align="center"
          label="姓名">
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          prop="introduce"
          label="简介">
          <template slot-scope="props">
            <el-popover
              placement="top-start"
              :title="props.row.name"
              width="350"
              trigger="hover"
              :content="props.row.introduce">
              <el-button slot="reference" type="text" v-text="">{{props.row.introduce.substring(0,5)}}...</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="本期大咖">
          <template slot-scope="props">
            <el-switch
              v-if="props.row.types===1"
              disabled
              v-model="props.row.types"
              active-color="#e7ecef"
              inactive-color="#13ce66"
              active-text="否"
              inactive-text="是"
              @change="setFlag(props.row)"
              :active-value="0"
              :inactive-value="1">
            </el-switch>
            <el-switch
              v-else
              v-model="props.row.types"
              active-color="#e7ecef"
              inactive-color="#13ce66"
              active-text="否"
              inactive-text="是"
              @change="setFlag(props.row)"
              :active-value="0"
              :inactive-value="1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          min-width="110px"
          prop="introduce"
          label="排序值">
          <template slot-scope="{row}">
            <template v-if="row.flag">
              <el-input v-model="row.num" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        type="number" style="width: 50%;float: left" size="small"/>
              <el-button
                size="small"
                icon="el-icon-refresh"
                type="warning"
                round
                style="float: right;top: inherit;"
                @click="cancelEdit(row)"
              >
                取消
              </el-button>
            </template>
            <el-button type="text"
                       size="small"
                       v-else
                       @click="row.flag=true,row.num=row.ssort"
                       round>
              {{row.ssort}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="250px"
          label="操作">
          <template slot-scope="props">
            <div v-if="props.row.flag">
              <el-button
                type="success"
                round
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(props.row.id)"
              >
                确定
              </el-button>
            </div>
            <div v-else>
              <el-button type="primary" v-if="hasPerm(`cel:edit`)" size="small" round
                         @click="editInformation(props.row.id)">编辑
              </el-button>
              <el-button type="primary" v-if="hasPerm(`cel:albu`)" size="small" round @click="editAlbum(props.row.id)">
                编辑相册
              </el-button>
              <el-button type="danger" v-if="hasPerm(`cel:dele`)&&props.row.types===1" disabled size="small" round
                         @click="deleInformation(props.row.id)">删除
              </el-button>
              <el-button type="danger" v-if="hasPerm(`cel:dele`)&&props.row.types!==1" size="small" round
                         @click="deleInformation(props.row.id)">删除
              </el-button>
            </div>

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
  import {fetchData, deleteBigStar, updateBigStarSort, setSuperBigStar} from '@/api/celebrity/index'
  import editAlbum from "./album/index";

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        type: false,
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'name'
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
        if (val !== undefined && val.prop === `introduce`) {
          if (val.order === undefined) {
            name = 'introduce'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'introduce'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'introduce'
            sort = 'asc'
          }
        }
        fetchData(this.currentPage, ``, this.size, name, sort, '').then(res => {
          if (res.queue.code === 1) {
            res.data.list.forEach(item => {
              let arr = []
              arr.push(item.avatar)
              item.src = arr
              item.flag = false
              item.num = ''
            })
            let arr = []
            res.data.list.forEach(item => {
              if (item.types === 1) {
                arr.unshift({
                  id: item.id,
                  name: item.name,
                  avatar: item.avatar,
                  introduce: item.introduce,
                  createdTime: item.createdTime,
                  types: item.types,
                  ssort: item.ssort
                })
              } else {
                arr.push({
                  id: item.id,
                  name: item.name,
                  avatar: item.avatar,
                  introduce: item.introduce,
                  createdTime: item.createdTime,
                  types: item.types,
                  ssort: item.ssort
                })
              }
            })
            this.list = arr
            this.total = res.data.total
          }
        })
      },
      addInformation() {
        this.$router.push({path: '/celebrity/addInformation'})
      },
      editInformation(id) {
        this.$router.push({path: '/celebrity/editInformation', query: {id: id}})
      },
      editAlbum(id) {
        this.$router.push({path: '/celebrity/album', query: {id: id}})
      },
      viewInformation(id) {
        this.$router.push({path: '/celebrity/detailInformation', query: {id: id}})
      },
      deleInformation(id) {
        this.$confirm('是否删除此大咖?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBigStar(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      cancelEdit(row) {
        this.list.forEach(item => {
          if (item.id == row.id) {
            item.flag = false
          }
        })
        row.flag = false
      },
      confirmEdit(id) {
        this.list.forEach(item => {
          if (item.id == id) {
            updateBigStarSort(id, item.num).then(res => {
              if (res.queue.code === 1) {
                this.mess("修改成功", "success")
                this.fetchData()
                item.flag = false
              }
            })
          }
        })
      },
      setFlag(row) {
        setSuperBigStar(row.id).then(item => {
          if (item.queue.code === 1) {
            this.mess("操作成功", "success")
            this.fetchData()
          }
        })
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
              res.data.list.forEach(item => {
                let arr = []
                arr.push(item.avatar)
                item.src = arr
                item.flag = false
              })
              let arr = []
              res.data.list.forEach(item => {
                if (item.types === 1) {
                  arr.unshift({
                    id: item.id,
                    name: item.name,
                    avatar: item.avatar,
                    introduce: item.introduce,
                    createdTime: item.createdTime,
                    types: item.types,
                    ssort: item.ssort
                  })
                } else {
                  arr.push({
                    id: item.id,
                    name: item.name,
                    avatar: item.avatar,
                    introduce: item.introduce,
                    createdTime: item.createdTime,
                    types: item.types,
                    ssort: item.ssort
                  })
                }
              })
              this.list = arr
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

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
