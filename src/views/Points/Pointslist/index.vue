<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" v-if="hasPerm(`Poi:fafa`)" size="small" class="el-icon-plus" style="margin-left: 92%" round @click="PointsIssue">
        积分发放
      </el-button>
      <!--<el-input style="width: 300px" prefix-icon="el-icon-search" size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>-->
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          label="发放时间"
          align="center">
          <template slot-scope="props">
            {{props.row.createdTime|dateformat(`YYYY-DD-MM HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="发放对象">
        </el-table-column>
        <el-table-column
          prop="num"
          align="center"
          label="积分数量">
        </el-table-column>
        <el-table-column
          prop="notice"
          align="center"
          label="发放通知">
        </el-table-column>
        <el-table-column
          prop="username"
          label="操作人"
          align="center">
        </el-table-column>
        <!--<el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" round @click="editInformation(props.row.id)">编辑</el-button>
            <el-button type="primary" size="small" round @click="deleInformation(props.row.id)">删除</el-button>
          </template>
        </el-table-column>-->
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
  import {findIntegral} from "@/api/points/index"

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
        let name = 'created_time'
        let sort = 'desc'
        findIntegral(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list;
            this.list.forEach(item => {
              if (item.types === 1) {
                item.name = "全部用户"
              }
            })
            this.total = res.data.total
          }
        })
      },
      PointsIssue() {
        this.$router.push({path: '/Points/Issue'})
      },
    },
    created() {
      this.fetchData()
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let name = 'created_time'
          let sort = 'desc'
          findIntegral(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
              this.list.forEach(item => {
                if (item.types === 1) {
                  item.name = "全部用户"
                }
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
</style>
