K
<template>
  <div>
    <el-card class="card-layout">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                    size="small" v-model="search" placeholder="请输入搜索内容"
                    clearable/>
        </el-col>
        <el-col :span="4">
          <el-select v-model="value" size="small" class="input" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="createdTime"
          label="创建时间"
          align="center"
        >
          <template slot-scope="props">
            {{props.row.createdTime|dateformat(`YYYY-DD-MM HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="召集标题">
        </el-table-column>
        <el-table-column
          align="center"
          prop="ename"
          label="所属展览">
        </el-table-column>
        <el-table-column
          prop="authorName"
          align="center"
          label="发起人">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" class="el-icon-view" round @click="view(props.row.id)">详细信息
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
      title="查看召集"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="50%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center"
    >
      <el-form ref="form" :model="convene" label-width="80px" style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="召集标题:">
              <div v-text="convene.name" class="divBorder"></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展览名称:">
              <div v-text="name" class="divBorder"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="发起人名:">
              <div v-text="convene.authorName" class="divBorder"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="召集地址:">
              <div v-text="convene.address" class="divBorder"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="活动时间:">
              <div class="divBorder">
                {{convene.assembleTime|dateformat(`YYYY-DD-MM`)}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="召集人数:">
              <div class="divBorder">
                {{convene.assembleSignPeopleNum}}/{{convene.assemblePeopleNum}}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="创建时间:">
              <div class="divBorder">
                {{convene.createdTime|dateformat(`YYYY-DD-MM HH:mm`)}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用:">
              <div class="divBorder">
                {{convene.expenses===0?'免费':convene.expenses}}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {findById, findAssembleDetails} from '@/api/convene/index'

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        Visible: false,
        convene: {},
        options: [
          {
            value: '1',
            label: '全部'
          },
          {
            value: '2',
            label: '未过期'
          }, {
            value: '3',
            label: '已过期'
          }],
        value: '1',
        name: this.$route.query.name
      }
    },
    methods: {
      fetchData() {
        let name = 'created_time'
        let sort = 'desc'
        findById(this.$route.query.id, this.currentPage, '', this.size, name, sort, this.value).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.list.forEach(item => {
              item.ename = this.$route.query.name
            })
            this.total = res.data.total
          }
        })
      },
      view(id) {
        findAssembleDetails(id).then(res => {
          if (res.queue.code === 1) {
            this.convene = res.data
            this.Visible = true
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
          let name = 'created_time'
          findById(this.$route.query.id, this.currentPage, search, this.size, name, sort, this.value).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
              this.list.forEach(item => {
                item.ename = this.$route.query.name
              })
              this.total = res.data.total
            }
          })
        }
      },
      value(value) {
        let sort = 'desc'
        let name = 'created_time'
        findById(this.$route.query.id, this.currentPage, '', this.size, name, sort, value).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list;
            this.list.forEach(item => {
              item.ename = this.$route.query.name
            })
            this.total = res.data.total
          }
        })
      }
    }
  }
</script>

<style>
  .divBorder {
    border-bottom: 1px solid #DCDFE6;
  }

  .divBorder:hover {
    border-bottom: 1px solid #409eff;
  }

  .divBorder div {
    border-bottom: 1px solid #409eff;
    transition: 0.1s;
  }

  .input .el-input__inner {
    height: 32px;
  }
</style>

