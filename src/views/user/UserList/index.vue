<template>
  <div>
    <el-card class="card-layout">
      <el-input style="width: 250px" size="small" type="text" maxlength="10" show-word-limit
                prefix-icon="el-icon-search" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        :default-sort="{prop: 'created_time', order: 'descending'}"
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column
          prop="createdTime"
          sortable
          label="注册日期"
          align="center">
          <template slot-scope="props">
            {{props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          label="昵称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="头像"
          align="center">
          <template slot-scope="props">
            <el-image
              style="width: 80px; height: 80px"
              :src="props.row.avatar"
              :preview-src-list="[props.row.avatar]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="integral"
          sortable
          label="积分"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
              <el-button type="primary" size="small" v-if="hasPerm(`use:view`)" round @click="view(props.row.id)">详细信息</el-button>
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
        title="详细信息"
        :visible.sync="VisibleDialogue"
        :close-on-click-modal="false"
        custom-class="customWidth"
        width="50%"
        :close-on-press-escape="false"
        show-clos="false"
        style="text-align: center"
      >
        <el-form ref="form" :model="user" label-width="80px" style="width: 100%">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="用户名称:">
                <div v-text="user" class="divBorder"></div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户头像:">
                <div class="divBorder">
                  {{user===null?'暂无':user}}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="用户钱包:">
                <div v-text="user" class="divBorder"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别:">
                <div v-text="user" class="divBorder"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {fetchData} from "@/api/user/index"

  export default {
    name: "index",
    data() {
      return {
        list:null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        VisibleDialogue: false,
        user: {}
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
        fetchData(this.currentPage, '', this.size, name, sort, '').then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      view(id) {
        this.$router.push({path: "/user/userDetail", query: {id: id}})
      }
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
          fetchData(this.currentPage, search, this.size, name, sort).then(res => {
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

<style scoped>
  .card-layout {
    margin: 8px;
  }
</style>
