<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card class="card-layout">
          <el-form ref="form" :model="user" label-width="80px">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="昵称:">
                  <div v-text="user.name" class="divBorder"></div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="头像:">
                  <el-image
                    style="width: 80px; height: 80px"
                    :src="user.avatar"
                    :preview-src-list="[user.avatar]">
                  </el-image>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="钱包:">
                  <div v-text="user.money" class="divBorder"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别:">
                  <div class="divBorder">
                    {{user.gender===1?"男士":"女士"}}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="国籍:">
                  <div class="divBorder">
                    {{user.language===`zh_CN`?"中国":user.language}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省市:">
                  <div class="divBorder">
                    {{user.province}}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="card-layout">
          <div class="todoapp">
            <div class="header-title">
              用户的评论
            </div>
          </div>
          <div v-infinite-scroll="loadMorecomment" :infinite-scroll-disabled="busycomment"
               infinite-scroll-immediate-check="false"
               infinite-scroll-distance="10"
               style="height: 205px;overflow-x: hidden">
            <div v-for="(item,index) in comment " v-if="comment!==null">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-card class="card-padding">
                    <div class="font-comment">
                      {{item.content}}
                    </div>
                    <div class="comment-iexhibition">
                      <div class="comment-iexhibition-img">
                        <el-image
                          style="width: 60px; height: 60px"
                          v-if="item.avatar!==`a`"
                          :src="item.avatar"
                          :preview-src-list="[item.avatar]">
                        </el-image>
                        <el-image
                          style="width: 60px; height: 60px"
                          v-if="item.avatar===`a`"
                          src="https://tse1-mm.cn.bing.net/th/id/OIP.a7D-38vjk2XrGKDNzkWoggAAAA?w=182&h=180&c=7&o=5&pid=1.7"
                          :preview-src-list="urlArray">
                        </el-image>
                      </div>
                      <div class="comment-font">
                        <div style="margin-left: 60px">
                          {{item.title}}
                        </div>
                        <div style="float: right;font-size: 8px;line-height: 1;padding-top:24px;padding-right: 4px">
                          {{item.createdTime}}
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="card-layout">
          <div class="todoapp">
            <div class="header-title">
              用户参加过的展览
            </div>
            <div class="main">
              <div v-infinite-scroll="loadMoreconvene" :infinite-scroll-disabled="busyconvene"
                   infinite-scroll-immediate-check="false"
                   infinite-scroll-distance="10"
                   style="height: 350px;overflow-x: hidden">
                <div v-for="(item, index) in convene" class="for-layout">
                  <el-card class="card-padding">
                    <el-row :gutter="10">
                      <el-col :span="4">
                        <div class="comment-iexhibition-img">
                          <el-image
                            style="width: 80px; height: 80px"
                            :src="item.avatar"
                            :preview-src-list="[item.avatar]">
                          </el-image>
                        </div>
                      </el-col>
                      <el-col :span="20">
                        <div class="comment-font">
                          {{item.title}}
                        </div>
                      </el-col>
                      <div
                        style="float: right;font-size: 8px;line-height: 1;padding-top:45px;height: 100%;margin-right: 6px">
                        {{item.createdTime}}
                      </div>
                    </el-row>
                  </el-card>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card-layout">
          <div class="todoapp">
            <div class="header-title">
              用户发起过的召集
            </div>
            <div class="main">
              <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy"
                   infinite-scroll-immediate-check="false"
                   infinite-scroll-distance="10"
                   style="height: 350px;overflow-x: hidden">
                <div v-for="(item, index) in initiate" class="for-layout">
                  <el-card class="card-padding">
                    <el-row :gutter="10">
                      <el-col :span="4">
                        <div class="comment-iexhibition-img">
                          <el-image
                            style="width: 80px; height: 80px"
                            :src="item.avatar"
                            :preview-src-list="[item.avatar]">
                          </el-image>
                        </div>
                      </el-col>
                      <el-col :span="20">
                        <div class="comment-font">
                          {{item.title}}
                        </div>
                      </el-col>
                      <div
                        style="float: right;font-size: 8px;line-height: 1;padding-top:45px;height: 100%;margin-right: 6px">
                        {{item.createdTime}}
                      </div>
                    </el-row>
                  </el-card>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {findSUserById, findCommentByUid, findInAssembleByUid, findAssembleByUid} from "@/api/user/index"

  export default {
    name: "index",
    data() {
      return {
        id: this.$route.query.id,
        group: 'mission',
        user: {},
        list: null,
        CityJson: {
          "Beijing": "北京",
          "Tianjin": "天津",
          "Shanghai": "上海",
          "Chongqing": "重庆",
          "Yinchuan": "银川",
          "Shizuishan": "石嘴山",
          "Wuzhong": "吴忠",
          "Guyuan": "固原",
          "Zhongwei": "中卫",
          "Wulumuqi": "乌鲁木齐",
          "Kelamayi": "克拉玛依",
          "Lasa": "拉萨",
          "Huhehaote": "呼和浩特",
          "Baotou": "包头",
          "Wuhai": "乌海",
          "Chifeng": "赤峰",
          "Tongliao": "通辽",
          "Eerduosi": "鄂尔多斯",
          "Hulunbeier": "呼伦贝尔",
          "Bayannaoer": "巴彦淖尔",
          "Wulanchabu": "乌兰察布",
          "Nanning": "南宁",
          "Liuzhou": "柳州",
          "Guilin": "桂林",
          "Wuzhou": "梧州",
          "Beihai": "北海",
          "Chongzuo": "崇左",
          "Laibin": "来宾",
          "Hezhou": "贺州",
          "Yulin": "玉林",
          "Baise": "百色",
          "Hechi": "河池",
          "Qinzhou": "钦州",
          "Fangchenggang": "防城港",
          "Guigang": "贵港",
          "Haerbin": "哈尔滨",
          "Daqing": "大庆",
          "Qiqihaer": "齐齐哈尔",
          "Jiamusi": "佳木斯",
          "Jixi": "鸡西",
          "Hegang": "鹤岗",
          "Shuangyashan": "双鸭山",
          "Mudanjiang": "牡丹江",
          "Yichun": "伊春",
          "Qitaihe": "七台河",
          "Heihe": "黑河",
          "Suihua": "绥化",
          "Changchun": "长春",
          "Jilin": "吉林",
          "Siping": "四平",
          "Liaoyuan": "辽源",
          "Tonghua": "通化",
          "Baishan": "白山",
          "Songyuan": "松原",
          "Baicheng": "白城",
          "Shenyang": "沈阳",
          "Dalian": "大连",
          "Anshan": "鞍山",
          "Fushun": "抚顺",
          "Benxi": "本溪",
          "Dandong": "丹东",
          "Jinzhou": "锦州",
          "Yingkou": "营口",
          "Fuxin": "阜新",
          "Liaoyang": "辽阳",
          "Panjin": "盘锦",
          "Tieling": "铁岭",
          "Chaoyang": "朝阳",
          "Huludao": "葫芦岛",
          "Shijiazhuang": "石家庄",
          "Tangshan": "唐山",
          "Handan": "邯郸",
          "Qinghuangdao": "秦皇岛",
          "Baoding": "保定",
          "Zhangjiakou": "张家口",
          "Chengde": "承德",
          "Langfang": "廊坊",
          "Cangzhou": "沧州",
          "Hengshui": "衡水",
          "Xingtai": "邢台",
          "Jinan": "济南",
          "Qingdao": "青岛",
          "Zibo": "淄博",
          "Zaozhuang": "枣庄",
          "Dongying": "东营",
          "Yantai": "烟台",
          "Weifang": "潍坊",
          "Jining": "济宁",
          "Taian": "泰安",
          "Weihai": "威海",
          "Rizhao": "日照",
          "Laiwu": "莱芜",
          "Linyi": "临沂",
          "Dezhou": "德州",
          "Liaocheng": "聊城",
          "Heze": "菏泽",
          "Binzhou": "滨州",
          "Nanjing": "南京",
          "Zhenjiang": "镇江",
          "Changzhou": "常州",
          "Wuxi": "无锡",
          "Suzhou": "苏州",
          "Xuzhou": "徐州",
          "Lianyungang": "连云港",
          "Huaian": "淮安",
          "Yancheng": "盐城",
          "Yangzhou": "扬州",
          "Taizhou": "泰州",
          "Nantong": "南通",
          "Suqian": "宿迁",
          "Hefei": "合肥",
          "Bengbu": "蚌埠",
          "Wuhu": "芜湖",
          "Huainan": "淮南",
          "Bozhou": "亳州",
          "Fuyang": "阜阳",
          "Huaibei": "淮北",
          "Suzhou": "宿州",
          "Chuzhou": "滁州",
          "Anqing": "安庆",
          "Chaohu": "巢湖",
          "Maanshan": "马鞍山",
          "Xuancheng": "宣城",
          "Huangshan": "黄山",
          "Chizhou": "池州",
          "Tongling": "铜陵",
          "Hangzhou": "杭州",
          "Jiaxing": "嘉兴",
          "Huzhou": "湖州",
          "Ningbo": "宁波",
          "Jinhua": "金华",
          "Wenzhou": "温州",
          "Lishui": "丽水",
          "Shaoxing": "绍兴",
          "Quzhou": "衢州",
          "Zhoushan": "舟山",
          "Taizhou": "台州",
          "Fuzhou": "福州",
          "Xiamen": "厦门",
          "Quanzhou": "泉州",
          "Sanming": "三明",
          "Nanping": "南平",
          "Zhangzhou": "漳州",
          "Putian": "莆田",
          "Ningde": "宁德",
          "Longyan": "龙岩",
          "Guangzhou": "广州",
          "Shenzhen": "深圳",
          "Shantou": "汕头",
          "Huizhou": "惠州",
          "Zhuhai": "珠海",
          "Jieyang": "揭阳",
          "Foshan": "佛山",
          "Heyuan": "河源",
          "Yangjiang": "阳江",
          "Maoming": "茂名",
          "Zhanjiang": "湛江",
          "Meizhou": "梅州",
          "Zhaoqing": "肇庆",
          "Shaoguan": "韶关",
          "Chaozhou": "潮州",
          "Dongguan": "东莞",
          "Zhongshan": "中山",
          "Qingyuan": "清远",
          "Jiangmen": "江门",
          "Shanwei": "汕尾",
          "Yunfu": "云浮",
          "Haikou": "海口",
          "Sanya": "三亚",
          "Kunming": "昆明",
          "Qujing": "曲靖",
          "Yuxi": "玉溪",
          "Baoshan": "保山",
          "Zhaotong": "昭通",
          "Lijiang": "丽江",
          "Puer": "普洱",
          "Lincang": "临沧",
          "Guiyang": "贵阳",
          "Liupanshui": "六盘水",
          "Zunyi": "遵义",
          "Anshun": "安顺",
          "Chengdu": "成都",
          "Mianyang": "绵阳",
          "Deyang": "德阳",
          "Guangyuan": "广元",
          "Zigong": "自贡",
          "Panzhihua": "攀枝花",
          "Leshan": "乐山",
          "Nanchong": "南充",
          "Neijiang": "内江",
          "Suining": "遂宁",
          "Guangan": "广安",
          "Luzhou": "泸州",
          "Dazhou": "达州",
          "Meishan": "眉山",
          "Yibin": "宜宾",
          "Yaan": "雅安",
          "Ziyang": "资阳",
          "Changsha": "长沙",
          "Zhuzhou": "株洲",
          "Xiangtan": "湘潭",
          "Hengyang": "衡阳",
          "Yueyang": "岳阳",
          "Chenzhou": "郴州",
          "Yongzhou": "永州",
          "Shaoyang": "邵阳",
          "Huaihua": "怀化",
          "Changde": "常德",
          "Yiyang": "益阳",
          "Zhangjiajie": "张家界",
          "Loudi": "娄底",
          "Wuhan": "武汉",
          "Xiangfan": "襄樊",
          "Yichang": "宜昌",
          "Huangshi": "黄石",
          "Ezhou": "鄂州",
          "Suizhou": "随州",
          "Jingzhou": "荆州",
          "Jingmen": "荆门",
          "Shiyan": "十堰",
          "Xiaogan": "孝感",
          "Huanggang": "黄冈",
          "Xianning": "咸宁",
          "Zhengzhou": "郑州",
          "Luoyang": "洛阳",
          "Kaifeng": "开封",
          "Luohe": "漯河",
          "Anyang": "安阳",
          "Xinxiang": "新乡",
          "Zhoukou": "周口",
          "Sanmenxia": "三门峡",
          "Jiaozuo": "焦作",
          "Pingdingshan": "平顶山",
          "Xinyang": "信阳",
          "Nanyang": "南阳",
          "Hebi": "鹤壁",
          "Puyang": "濮阳",
          "Xuchang": "许昌",
          "Shangqiu": "商丘",
          "Zhumadian": "驻马店",
          "Taiyuan": "太原",
          "DaTong": "大同",
          "Xinzhou": "忻州",
          "Yangquan": "阳泉",
          "Changzhi": "长治",
          "Jincheng": "晋城",
          "Shuozhou": "朔州",
          "Jinzhong": "晋中",
          "Yuncheng": "运城",
          "Linfen": "临汾",
          "Lvliang": "吕梁",
          "Xian": "西安",
          "Xianyang": "咸阳",
          "Tongchuan": "铜川",
          "Yanan": "延安",
          "Baoji": "宝鸡",
          "Weinan": "渭南",
          "Hanzhoung": "汉中",
          "Ankang": "安康",
          "Shangluo": "商洛",
          "Yulin": "榆林",
          "Lanzhou": "兰州",
          "Tianshui": "天水",
          "Pingliang": "平凉",
          "Jiuquan": "酒泉",
          "Jiayuguan": "嘉峪关",
          "Jinchang": "金昌",
          "baiyiin": "白银",
          "Wuwei": "武威",
          "Zhangye": "张掖",
          "Qingyang": "庆阳",
          "Dingxi": "定西",
          "Longnan": "陇南",
          "Xining": "西宁",
          "Nanchang": "南昌",
          "Jiujiang": "九江",
          "Ganzhou": "赣州",
          "Jian": "吉安",
          "Yingtan": "鹰潭",
          "Shangrao": "上饶",
          "Pingxiang": "萍乡",
          "Jingdezhen": "景德镇",
          "Xinyu": "新余",
          "Yichun": "宜春",
          "Fuzhou": "抚州"
        },
        comment: [],
        commentPage: 1,
        commentSize: 5,
        convene: [],
        convenePage: 1,
        conveneSize: 5,
        initiate: [],
        initiatePage: 1,
        initiateSize: 5,
        busy: true,
        busyconvene: true,
        busycomment: true,
        urlArray:[`https://tse1-mm.cn.bing.net/th/id/OIP.a7D-38vjk2XrGKDNzkWoggAAAA?w=182&h=180&c=7&o=5&pid=1.7`]
      }
    },
    methods: {
      async loadMore() {
        if (this.busy) {
          this.initiatePage = this.initiatePage + 1
          await findAssembleByUid(this.id, this.initiatePage, this.initiateSize, 'created_time', 'desc').then(res => {
            if (res.queue.code === 1) {
              if (res.data.total <= this.initiatePage * this.initiateSize) {
                this.busy = false
              }
              res.data.list.forEach(item => {
                this.initiate.push(item)
              })
            }
          })
        }

      },
      async loadMoreconvene() {
        if (this.busyconvene) {
          this.convenePage = this.convenePage + 1
          await findInAssembleByUid(this.id, this.convenePage, this.conveneSize, 'created_time', 'desc').then(res => {
            if (res.queue.code === 1) {
              if (res.data.total <= this.convenePage * this.conveneSize) {
                this.busyconvene = false
              }
              res.data.list.forEach(item => {
                this.convene.push(item)
              })
            }
          })
        }
      },
      async loadMorecomment() {
        if (this.busycomment) {
          this.commentPage = this.commentPage + 1
          await findCommentByUid(this.id, this.commentPage, this.commentSize, 'created_time', 'desc').then(res => {
            if (res.queue.code === 1) {
              if (res.data.total <= this.commentPage * this.commentSize) {
                this.busycomment = false
              }
              res.data.list.forEach(item => {
                this.comment.push(item)
              })
            }
          })
        }
      },
      findSUserById() {
        findSUserById(this.id).then(res => {
          if (res.queue.code === 1) {
            for (let i in this.CityJson) {
              if (res.data.province === i) {
                res.data.province = this.CityJson[i]
              }
            }
            this.user = res.data
          }
        })
      },
      findCommentByUid() {
        findCommentByUid(this.id, this.commentPage, this.commentSize, 'created_time', 'desc').then(res => {
          if (res.queue.code === 1) {
            this.comment = res.data.list
          }
        })
      },
      findInAssembleByUid() {
        findInAssembleByUid(this.id, this.convenePage, this.conveneSize, 'created_time', 'desc').then(res => {
          if (res.queue.code === 1) {
            this.convene = res.data.list
          }
        })
      },
      findAssembleByUid() {
        findAssembleByUid(this.id, this.initiatePage, this.initiateSize, 'created_time', 'desc').then(res => {
          if (res.queue.code === 1) {
            this.initiate = res.data.list
          }
        })
      }
    },
    created() {
      this.findSUserById();
      this.findAssembleByUid();
      this.findCommentByUid();
      this.findInAssembleByUid();
    }
  }
</script>

<style lang="scss" scoped>
  .card-layout {
    margin: 8px;
  }

  .header-title {
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    padding: 10px 16px 10px 16px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    -webkit-box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  .todoapp {
    font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.4em;
    color: #4d4d4d;
    min-width: 230px;
    max-width: 550px;
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
    background: #fff;
    z-index: 1;
    position: relative;
  }

  .main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #ededed;
  }

  .for-layout {
    position: relative;
    font-size: 14px;
    /*border-bottom: 1px solid #ededed;*/
    line-height: 2;
  }

  .comment {

  }

  .font-comment {
    font-weight: 400;
    line-height: initial;
    text-align: left;
    font: 15px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding-bottom: 4px;
  }

  .comment-iexhibition {
    background-color: #fafafa;
    width: 100%;
    height: 60px;
  }

  .comment-iexhibition-img {
    padding: 0px;
    border-radius: 5px;
    width: 50px;
    height: 50px;
    float: left;
  }

  .comment-font {
    width: 100%;
    font-weight: 400;
    line-height: initial;
    text-align: left;
    font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding-top: 2px;
    padding-left: 4px;
  }
</style>
<style scoped>

  .card-layout .el-card__body {
    padding: 10px !important;
  }

  .card-layout .el-card__body .todoapp {
    margin: 0px !important;
    min-width: 10px;
    max-width: 1000px;
  }
</style>
<style>
  .card-padding .el-card__body {
    padding: 0px !important;
    min-height: 80px;
  }

  .card-padding {
    margin: 0px 6px 6px 6px;
  }
</style>
