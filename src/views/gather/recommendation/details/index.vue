<template>
  <el-card class="card-layout" align="center">
    <el-row>
      <el-col :span="9">
        <div id="container" style="width:630px;height:500px;border: 1px solid #2b2f3a">
        </div>
        <div style='width: 500px; height: 180px' id="infoDiv"></div>
      </el-col>
      <el-col :span="15">
        <el-form ref="domains" label-width="100px" class="demo-dynamic">
          <div v-for="(item,index) in  domains">
            <el-form-item
              prop="exhibition"
              :label="'展览'+(index+1)+':'"
            >
              <el-select v-model="item.exhibitionId" @change="cityTest(item.exhibitionId,index)" filterable clearable
                         placeholder="请选择" style="width: 80%;align:left">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span style="min-width: 42px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-form-item>
            <el-form-item
              prop="time"
              :label="`时间`+(index+1)+':'"
            >
              <el-time-picker
                is-range
                style="width: 80%;"
                v-model="item.timeData"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
              <el-button @click.prevent="removeDomain(index)" v-if="index===1||index>1" size="small">删除</el-button>
              <span style="min-width: 42px" v-if="index!==1 && index<1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-form-item>
            <!--<el-form-item
              prop="recommendation"
              :label="`路线`+(index+1)+':'"
            >
              <el-input v-model="item.recommendation" type="textarea" style="width: 80%;" :rows="3"
                        placeholder="请输入路线文案"></el-input>
              <el-button @click.prevent="removeDomain(index)" v-if="index===1||index>1" size="small">删除</el-button>
              <span style="min-width: 42px" v-if="index!==1 && index<1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

            </el-form-item>-->
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" size="small">提交</el-button>
            <el-button @click="addDomain" size="small" v-if="flag">新增路线</el-button>
            <el-button @click="resetForm()" size="small" style="margin-right: 18%">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import {optionEnd, findRecomExhibition} from '@/api/recommendation/index'

  export default {
    name: 'news',
    data() {
      return {
        longitude: 0,//经度
        latitude: 0,//纬度
        city: '',
        domains: [{
          timeData: '',
          exhibitionId: '',
          recommendation: ''
        }],
        options: null,
        flag: true,
        search: '',
      }
    },
    methods: {
      //第一部分
      //定位获得当前位置信息
      getMyLocation() {
        let geolocation = new qq.maps.Geolocation("KFNBZ-FXLC6-CLXSX-M76FI-LNHIE-7PBSC", "揽集-管理员位置选择");
        geolocation.getLocation(this.showPosition, this.showErr);//或者用getLocation精确度比较高
      },
      showPosition(position) {
        this.latitude = position.lat;
        this.longitude = position.lng;
        this.city = position.city;
        this.setMap();
      },
      showErr() {
        this.getMyLocation();//定位失败再请求定位，测试使用
      },
      //位置信息在地图上展示
      async  setMap() {
        var myLatlng = new qq.maps.LatLng(this.latitude, this.longitude);
        var myOptions = {
          rotation: 20,//设置地图旋转角度
          pitch: 30, //设置俯仰角度（0~45）
          zoom: 10,//设置地图缩放级别
          center: myLatlng//设置地图中心点坐标
        }
        // //获取dom元素添加地图信息
        var map = new qq.maps.Map(document.getElementById("container"), myOptions);
        //res即点击后的位置信息
        qq.maps.event.addListener(map, 'click', (e) => {
          console.log(e, '别点我鸭')
        });
        var infoWin = new qq.maps.InfoWindow({
          map: map
        });
        let geocoder = new qq.maps.Geocoder();
        let arr = [];
        await findRecomExhibition(`1`, this.$route.query.id, '', 100, 'name', 'desc').then(res => {
          if (res.queue.code === 1) {
            res.data.list.forEach(item=>{
              var address = "中国" + item.address;
              //对指定地址进行解析
              geocoder.getLocation(address);
              //设置服务请求成功的回调函数
              geocoder.setComplete(function (result) {
                arr.push({name:item.name,url:new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng)})
              });
            })
            this.options = res.data.list;
          }
        })
        arr.forEach((item, index) => {
          var marker = new qq.maps.Marker({
            position: item.url,
            map: map
          });
          infoWin.open();
          //tips  自定义内容
          infoWin.setContent('<div style="width:auto;padding:4px;">'+item.name+ '</div>');
          infoWin.setPosition(marker);
        })
        /* //实例化自动完成
         var keyword = "";
         //调用Poi检索类。用于进行本地检索、周边检索等服务。
         var searchService = new qq.maps.SearchService({
           complete : function(results){
             if(results.type === "CITY_LIST") {
               searchService.setLocation(results.detailInformation.cities[0].cityName);
               searchService.search(keyword);
               return;
             }
             var pois = results.detailInformation.pois;
             var latlngBounds = new qq.maps.LatLngBounds();
             for(var i = 0,l = pois.length;i < l; i++){
               var poi = pois[i];
               latlngBounds.extend(poi.latLng);
               var marker = new qq.maps.Marker({
                 map:map,
                 position: poi.latLng
               });
               marker.setTitle(poi.name);
             }
             map.fitBounds(latlngBounds);
           }
         });
         keyword = this.search;
         searchService.search(keyword);*/
      },
      codeAddress(name) {
        let _this = this
        var geocoder, map, marker = null;
        geocoder = new qq.maps.Geocoder();
        var address = "中国" + this.search;
        //对指定地址进行解析
        geocoder.getLocation(address);
        //设置服务请求成功的回调函数
        geocoder.setComplete(function (result) {
          _this.one.push({name:name,url:new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng)})
        });
        _this.setMap()
        //若服务请求失败，则运行以下函数
        geocoder.setError(function () {
          alert("出错了，请输入正确的地址！！！");
        });
      },
      submitForm(domains) {
        let flag = true;
        this.domains.forEach(item => {
          if (item.timeData === '' && item.exhibitionId === '') {
            flag = false
          }
          if (flag) {
            this.domains.forEach(item => {
              let obj = ''
              for (let t = 0; t < item.timeData.length; t++) {
                obj += item.timeData[t].format(`hh:MM:ss`) + "-"
              }
              item.time = obj.substr(0, obj.length - 1)
            })
            optionEnd(this.$route.query.id,this.domains).then(res => {
              if (res.queue.code === 1) {
                this.mess('推荐成功', 'success');
                this.$router.push('/gather/recommendation')
              }
            })
          } else {
            return this.mess('请填写完整在提交', 'warning')
          }
        })
      },
      resetForm() {
        this.domains[this.domains.length - 1].timeData = ''
        this.domains[this.domains.length - 1].exhibitionId = ''
        this.domains[this.domains.length - 1].recommendation = ''
      },
      removeDomain(item) {
        this.domains.splice(item, 1)
      },
      addDomain() {
        if (this.domains.length === 3) return this.flag = false;
        this.domains.push({
          time: '',
          exhibition: '',
          recommendation: ''
        });
      },
      fetchData() {
        findRecomExhibition(`1`, this.$route.query.id, '', 100, 'name', 'desc').then(res => {
          if (res.queue.code === 1) {
            this.options = res.data.list;
          }
        })
      },
      cityTest(id,index) {
        this.options.forEach(item => {
          if (item.id === id) {
            this.search = item.address
            /*this.setMap()*/
          }
        })
      }
    },
    mounted() {
      this.getMyLocation();
    },
    watch: {
      domains(domains) {
        if (domains.length >= 3) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      search(search) {
        if (search !== '') {
          this.setMap()
        }
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>
<style>
  .demo-dynamic {
    margin-left: 15%;
    width: 60%;
  }
</style>
