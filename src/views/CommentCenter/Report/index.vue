<template>
  <div>
    <el-card class="card-layout">
      <el-input style="width: 300px" prefix-icon="el-icon-search" size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="createdTime"
          label="日期"
          align="center">
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="内容主体"
          align="center">
          <template slot-scope="props">
            {{props.row.content}}
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="评论类型"
          align="center">
          <template slot-scope="props">
            {{props.row.tableName===1?"展评":"分享"}}
          </template>
        </el-table-column>
        <el-table-column
          label="评论内容"
          align="center">
          <template slot-scope="props">
            {{props.row.tipOffContent}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="评论者"
          align="center">
        </el-table-column>
        <el-table-column
          prop="tableName"
          label="被举报次数"
          align="center">
          <template slot-scope="props">
            <el-popover
              placement="right"
              width="500"
              trigger="click">
              <el-table :data="props.row.hulks">
                <el-table-column  width="130" align="center" label="日期">
                  <template slot-scope="props">
                    {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
                  </template>
                </el-table-column>
                <el-table-column align="center" property="reason" label="姓名"></el-table-column>
                <el-table-column align="center" property="name" label="昵称"></el-table-column>
              </el-table>
              <el-button slot="reference" type="text">{{props.row.tableName}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <!--<el-table-column
          prop="address"
          label="举报原因"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="举报者"
          align="center">
        </el-table-column>-->
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="danger" v-if="hasPerm(`Rep:dele`)" round @click="deleInformation(props.row.id,props.row.tableName)" size="small">删除</el-button>
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
  import {findTipOffComment,punish} from "@/api/CommentCenter/index"

  export default {
    name: "index",
    data() {
      return {
        list: null,
        dataContent: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
      }
    },
    methods: {
      fetchData() {
        let sort = 'desc'
        let name = 'created_time'
        findTipOffComment(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.total
          }
        })
      },
      deleInformation(id,type) {
        this.$confirm('是否删除此评论?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          punish(id,type).then(res=>{
            if(res.queue.code===1){
              this.fetchData()
              this.mess("删除成功","success")
            }
          })
        }).catch(() => {
        })
      },
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
          findTipOffComment(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.total
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

  .object-preview-object-url {
    text-align: left;
    padding: 8px;
    line-height: 1.4;
    border: 1px solid #dedede;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
</style>

