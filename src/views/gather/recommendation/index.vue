<template>
  <div>
    <el-card class="card-layout">
      <el-input prefix-icon="el-icon-search" style="width: 250px" type="text" maxlength="10" show-word-limit  size="small" clearable v-model="search"
                v-if="hasPerm(`rec:reco`)"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        :default-sort="{prop: 'rrc.created_time', order: 'desc'}"
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="createdTime"
          sortable
          label="时间">
          <template slot-scope="props">
            {{props.row.createdTime|dateformat(`YYYY-MM-DD HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="typeList"
          align="center"
          label="形式">
        </el-table-column>
        <el-table-column
          prop="tagList"
          align="center"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="city"
          label="所在市"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          prop="exhibitionTime"
          label="出行时间">
          <template slot-scope="props">
            {{props.row.exhibitionTime | dateformat(`YYYY-MM-HH hh:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" round size="small" v-if="hasPerm(`rec:tuij`)" @click="recommend(props.row.id)">推荐</el-button>
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
  import {fetchData} from '@/api/recommendation/index'
  import {optionList} from '@/utils/Global'
  export default {
    name: "index",
    data() {
      return {
        search: null,
        list: null,
        currentPage: 1,
        total: 0,
        size: 10,
      }
    },
    methods:{
      fetchData(val){
        let sort = 'desc';
        let name = 'rrc.created_time';
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'rrc.created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'rrc.created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'rrc.created_time'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `exhibitionTime`) {
          if (val.order === undefined) {
            name = 'exhibition_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'exhibition_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'exhibition_time'
            sort = 'asc'
          }
        }
        fetchData(this.currentPage,``,this.size,name,sort).then(res=>{
          if(res.queue.code===1){
            this.list=res.data.list
            this.total = res.data.total
            this.list.forEach(Item=>{
              let obj = ''
              let val = ''
              if(Item.tags.length!==0){
                Item.tags.forEach(key=>{
                  obj+=key.name+"--"
                })
                Item.tagList= obj.substr(0,obj.length-2);
              }
              if(Item.types.length!==0){
                Item.types.forEach(key=>{
                  optionList.forEach(cr=>{
                    if(cr.id===key){
                      val+=cr.name+`--`
                    }
                  })
                })
                Item.typeList= val.substr(0,val.length-2);
              }
            })
          }
        })
      },
      recommend(id){
        this.$router.push({path:'/gather/recommendationDetails',query:{id:id}})
      }
    },
    created() {
      this.fetchData()
    },
    watch:{
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc';
          let name = 'rrc.created_time';
          fetchData(this.currentPage,search,this.size,name,sort).then(res=>{
            if(res.queue.code===1){
              this.list=res.data.list
              this.total = res.data.total
              this.list.forEach(Item=>{
                let obj = ''
                let val = ''
                if(Item.tags.length!==0){
                  Item.tags.forEach(key=>{
                    obj+=key.name+"--"
                  })
                  Item.tagList= obj.substr(0,obj.length-2);
                }
                if(Item.types.length!==0){
                  Item.types.forEach(key=>{
                    optionList.forEach(cr=>{
                      if(cr.id===key){
                        val+=cr.name+`--`
                      }
                    })
                  })
                  Item.typeList= val.substr(0,val.length-2);
                }
              })
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

</style>
