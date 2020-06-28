<template>
  <div>
    <el-card class="card-layout">
      <el-row :gutter="10">
        <el-col :span="10">
            <el-input v-if="这是你的条件" style="width: 230px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search" size="small" v-model="search" placeholder="请输入搜索内容"
                    clearable/>
          //v-else也就是说上面不满足条件的时候就渲染下面这个
          <el-input v-else style="width: 230px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search" size="small" v-model="search" placeholder="请输入搜索内容"
                    clearable/>
        </el-col>
        <el-col :span="10" style="height: 32px">

        </el-col>
        <el-col :span="4">
          <el-select v-model="community" class="input" clearable placeholder="请选择">
            <el-option
              v-for="item in option"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!--<el-select v-model="value" class="input" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          type="index"
          width="10">
        </el-table-column>
        <el-table-column
          prop=""
          align="center"
          label="热力值">
          <template>
            1000
          </template>
        </el-table-column>
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
          prop="exhibitionName"
          label="所属展览">
        </el-table-column>
        <el-table-column
          prop="authorName"
          align="center"
          label="发起人">
        </el-table-column>
        <el-table-column
          align="center"
          min-width="130px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" class="el-icon-view" round @click="view(props.row.id)">详细信息</el-button>
            <el-button type="primary" size="small" class="el-icon-view" round @click="viewExhibition(props.row.exhibitionId)">查看展览</el-button>
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
      title="详细信息"
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
              <div class="divBorder">
                {{convene.exhibitionName===null?'暂无':convene.exhibitionName}}
              </div>
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
                {{convene.expenses===`0`?'免费':convene.expenses}}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      title="查看展览"
      :visible.sync="VisibleExhibition"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="50%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center"
    >
      <el-form ref="form" :model="exhibition" label-width="80px" style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="展览名称:">
              <div v-text="exhibition.name" class="divBorder"></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展馆名称:">
              <div v-text="exhibition.hallName" class="divBorder"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="展览状态:">
              <div class="divBorder">
                  {{exhibition.status===`0`?'已下架':'展览中'}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展览地址:">
              <div v-text="exhibition.address" class="divBorder"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="展览类型:">
              <div class="divBorder">
                {{exhibition.exhibitionName}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展览标签:">
              <div class="divBorder" v-if="exhibition.tagList!==''">
                <el-tag
                  v-for="tag in exhibition.tagList"
                  :key="tag.id"
                  type="primary">
                  {{tag.name}}
                </el-tag>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="开始时间:">
              <div class="divBorder">
                {{exhibition.startTime |dateformat(`YYYY-MM-HH`)}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间:">
              <div class="divBorder">
                {{exhibition.endTime |dateformat(`YYYY-MM-HH`)}}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="展览封面:">
              <img :src="exhibition.avatar" class="divBorder" height="100px" width="100px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展览备注:">
              <div class="divBorder" v-html="exhibition.signUpWay">
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchData, findAssembleDetails} from '@/api/convene/index'
  import {findAreaAndCity1} from '@/api/gather/index'
  import {findExhibitionById} from '@/api/exhibition/index'
  export default {
    name: "index",
    data() {
      return {
        list:null,
        search:'',
        currentPage: 1,
        total: 0,
        size: 10,
        Visible: false,
        VisibleExhibition: false,
        convene: {},
        options: [
          {
            value: '1',
            label: '全部'
          },{
            value: '2',
            label: '未过期'
          }, {
            value: '3',
            label: '已过期'
          }],
        value: '1',
        exhibition:{},
        community:'',
        option:[],
        props: {
          label: 'name',
          value: 'id',
          children: 'areas'
        }
      }
    },
    methods: {
      fetchData() {
        let name = 'created_time'
        let sort = 'desc'
        fetchData(this.community,this.currentPage, '', this.size, name, sort,this.value).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
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
      },
      viewExhibition(id){
        findExhibitionById(id).then(res=>{
          if(res.queue.code===1){
            if (res.data.exhibitionType === 1) {
              res.data.exhibitionName = `展览`
            }
            if (res.data.exhibitionType === 2) {
              res.data.exhibitionName = `讲座`
            }
            if (res.data.exhibitionType === 3) {
              res.data.exhibitionName = `书友会`
            }
            this.exhibition=res.data
            this.VisibleExhibition=true
          }
        })
      }
    },
    created() {
      this.fetchData()
      findAreaAndCity1().then(res => {
        this.option = res.data
      })
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          fetchData(this.community,this.currentPage, search, this.size, name, sort, this.value).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
              this.total = res.data.total
            }
          })
        }
      },
      community(community) {
        if (community !== '' || community !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          fetchData(community,this.currentPage,this.search, this.size, name, sort, this.value).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
              this.total = res.data.total
            }
          })
        }
      },
      value(value){
        let sort = 'desc'
        let name = 'created_time'
        fetchData(this.community,this.currentPage, this.search, this.size, name, sort, value).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list;
            this.total = res.data.total
          }
        })
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

  .input .el-input__inner{
    height: 32px;
  }
  .cascader .el-input__inner{
    height: 32px;
  }
  .cascader .el-input {
    height: 32px;
  }
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

