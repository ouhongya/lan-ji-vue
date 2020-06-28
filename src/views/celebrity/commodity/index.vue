<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small" class="el-icon-plus" style="float: right" round
                 v-if="hasPerm(`com:add`)"
                 @click="addCommodity">
        添加商品
      </el-button>
      <el-input style="width: 250px" prefix-icon="el-icon-search" size="small" type="text" maxlength="10"
                show-word-limit v-model="search" placeholder="请输入搜索内容"
                clearable/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.description}}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ props.row.bigStarShopClassName}}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createdTime}}</span>
              </el-form-item>
              <el-form-item label="商品封面">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="props.row.url"
                  :preview-src-list="[props.row.url]">
                </el-image>
              </el-form-item>
              <el-form-item label="商品详情">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="props.row.detailsUrl"
                  :preview-src-list="[props.row.detailsUrl]">
                </el-image>
              </el-form-item>
              <el-form-item label="商品规格">
                <span v-for=" item in props.row.starShopSpecs">
                  <ins>{{item.name}}</ins>/￥<ins>{{item.price}}</ins>元&nbsp;&nbsp;
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          sortable
          align="center"
          label="时间">
          <template slot-scope="props">
            {{props.row.createdTime|dateformat(`YYYY-MM-DD HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          sortable
          label="名称">
          <template slot-scope="props">
            <p>{{props.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="图片">
          <template slot-scope="props">
            <el-image
              style="width: 100px; height: 100px"
              :src="props.row.url"
              :preview-src-list="[props.row.url]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          sortable
          label="状态">
          <template slot-scope="props">
            {{props.row.status===0?'下架':'上架'}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="250px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm(`com:edit`)" round
                       @click="editCommodity(props.row.id)">编辑
            </el-button>
            <el-button type="primary" size="small" v-if="hasPerm(`com:updo`)" round
                       @click="upDdown(props.row.id,props.row.status)">
              {{props.row.status===0?'上架':'下架'}}
            </el-button>
            <el-button type="danger" size="small" v-if="hasPerm(`com:dele`)" round @click="deleCommodity(props.row.id)">
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
  </div>
</template>

<script>
  import {fetchData, deleteBigStarShop, findAllBigStart} from "@/api/celebrity/BigStarShop";
  import {signUDBigStarShop} from '@/api/celebrity/index'

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        start: null,
        id: ''
      }
    },
    methods: {
      fetchData(val) {
        this.currentPage = 1
        let sort = 'desc'
        let name = 'bss.created_time'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'bss.created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'bss.created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'bss.created_time'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `name`) {
          if (val.order === undefined) {
            name = 'name'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'name'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `name`) {
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
        fetchData(this.id, this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      addCommodity() {
        this.$router.push({path: '/celebrity/addCommodity'})
      },
      editCommodity(id) {
        this.$router.push({path: '/celebrity/editCommodity', query: {id: id}})
      },
      upDdown(id, status) {
        if (status === 1) {
          this.$confirm('是否下架此商品', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            signUDBigStarShop(id, `0`).then(res => {
              if (res.queue.code === 1) {
                this.mess('下架成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        } else {
          this.$confirm('是否上架此商品', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            signUDBigStarShop(id, `1`).then(res => {
              if (res.queue.code === 1) {
                this.mess('上架成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        }
      },
      deleCommodity(id) {
        this.$confirm('是否删除此商品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBigStarShop(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      fetchBigStart() {
        findAllBigStart().then(res => {
          if (res.queue.code === 1) {
            this.start = res.data.list
          }
        })
      },
    },
    created() {
      this.fetchData()
      this.fetchBigStart()
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'name'
          fetchData('', this.currentPage, search, this.size, name, sort, '').then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .demo-table-expand {
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

  .el-card-image {
    .el-card__body {
      padding: 0px;
    }

    margin: 6px;
  }

  .el-image-layout {
    border-radius: 10px;
    margin-right: 6px;
    margin-top: 4px;
  }

  .card-div-layout {
    width: 100%;
    overflow-y: hidden;
    white-space: nowrap
  }
</style>
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
