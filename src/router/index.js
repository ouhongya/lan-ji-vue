import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import account from '@/views/system/account/index'
import role from '@/views/system/role/index'
import addRole from '@/views/system/role/addRole/index'
import city from '@/views/system/city/index'
import label from '@/views/system/label/index'
import addAcc from '@/views/system/account/add/index'
import editUser from '@/views/system/account/edit/index'
import editRole from '@/views/system/role/editRole/index'
import pavilion from '@/views/gather/pavilion'
import exhibition from '@/views/gather/exhibition'
import addExhibition from '@/views/gather/exhibition/addExhibition'
import editExhibition from '@/views/gather/exhibition/editExhibition'
import recommendation from '@/views/gather/recommendation'
import recommendationDetails from '@/views/gather/recommendation/details'
import information from '@/views/celebrity/information'
import addInformation from '@/views/celebrity/information/addInformation'
import editInformation from '@/views/celebrity/information/editInformation'
import Album from '@/views/celebrity/information/album'
import bigStarShopLabel from '@/views/celebrity/bigStarShopLabel'
import commodity from '@/views/celebrity/commodity'
import addCommodity from '@/views/celebrity/commodity/addCommodity'
import editCommodity from '@/views/celebrity/commodity/editCommodity'
import Convocation from '@/views/convene/Convocation/index'
import userList from '@/views/user/UserList/index'
import userDetail from '@/views/user/UserDetail'
import Report from '@/views/CommentCenter/Report'
import PointsList from '@/views/Points/Pointslist'
import Issue from '@/views/Points/Issue'
import activityIndex from '@/views/activity/indexTable'
import addActivity from '@/views/activity/components/addActivity'
import editActivity from '@/views/activity/components/editActivity'
/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        hidden: true,
        component: () => import('@/views/index'),
        meta: {title: '首页', icon: 'dashboard'}
      }]
  },
  /*{
    path: '/system',
    component: Layout,
    name: 'system',
    alwaysShow: true,
    meta: {title: '系统设置', icon: 'example'},
    children: [
      {
        path: 'account',
        name: 'account',
        component: account,
        meta: {title: '账号设置'}
      },
      {
        path: 'role',
        name: 'role',
        component: role,
        meta: {title: '角色设置'}
      },
      {
        path: 'addRole',
        name: 'addRole',
        hidden: true,
        component: addRole,
        meta: {title: '添加角色'}
      },
      {
        path: 'editRole',
        name: 'editRole',
        hidden: true,
        component: editRole,
        meta: {title: '编辑角色'}
      },
      {
        path: 'editUser',
        name: 'editUser',
        hidden: true,
        component: editUser,
        meta: {title: '编辑账号'}
      },
      {
        path: 'addAcc',
        name: 'addAcc',
        hidden: true,
        component: addAcc,
        meta: {title: '添加账号'}
      },
      {
        path: 'areaAndCity',
        component: city,
        name: 'areaAndCity',
        meta: {title: '市区'}
      },
      {
        path: 'label',
        component: label,
        name: 'label',
        meta: {title: '标签'}
      }
    ]
  },
  {
    path: '/convene',
    component: Layout,
    name: 'convene',
    alwaysShow: true,
    meta: {title: '展览召集', icon: 'convene'},
    children: [
      {
        path: 'Convocation',
        name: 'Convocation',
        component: Convocation,
        meta: {title: '召集列表'}
      }
    ]
  },
  {
    path: '/gather',
    component: Layout,
    name: 'gather',
    alwaysShow: true,
    meta: {title: '览集讲座', icon: 'gather'},
    children: [
      {
        name: 'pavilion',
        path: 'pavilion',
        component: pavilion,
        meta: {title: '展馆信息'}
      },
      {
        name: 'exhibition',
        path: 'exhibition',
        component: exhibition,
        meta: {title: '展览召集'}
      },
      {
        name: 'addExhibition',
        path: 'addExhibition',
        hidden: true,
        component: addExhibition,
        meta: {title: '添加展览'}
      },
      {
        name: 'editExhibition',
        path: 'editExhibition',
        hidden: true,
        component: editExhibition,
        meta: {title: '编辑展览'}
      },
      {
        name: 'recommendation',
        path: 'recommendation',
        component: recommendation,
        meta: {title: '路线推荐'}
      },
      {
        name: 'recommendationDetails',
        path: 'recommendationDetails',
        hidden: true,
        component: recommendationDetails,
        meta: {title: '推荐详情'}
      },
    ]
  },
  {
    path: '/celebrity',
    component: Layout,
    name: 'celebrity',
    alwaysShow: true,
    meta: {title: '大咖空间', icon: 'celebrity'},
    children: [
      {
        path: 'information',
        name: 'information',
        component: information,
        meta: {title: '大咖列表'}
      },
      {
        path: 'addInformation',
        name: 'addInformation',
        component: addInformation,
        hidden: true,
        meta: {title: '添加大咖'}
      },
      {
        path: 'editInformation',
        name: 'editInformation',
        component: editInformation,
        hidden: true,
        meta: {title: '编辑大咖'}
      },
      {
        path: 'Album',
        name: 'Album',
        component: Album,
        hidden: true,
        meta: {title: '大咖相册'}
      },
      {
        path: 'bigStarShopLabel',
        name: 'bigStarShopLabel',
        component: bigStarShopLabel,
        meta: {title: '大咖商品分类'}
      },
      {
        path: 'commodity',
        name: 'commodity',
        component: commodity,
        meta: {title: '大咖商品列表'}
      },
      {
        path: 'addCommodity',
        name: 'addCommodity',
        component: addCommodity,
        hidden: true,
        meta: {title: '添加商品'}
      },
      {
        path: 'editCommodity',
        name: 'editCommodity',
        component: editCommodity,
        hidden: true,
        meta: {title: '编辑商品'}
      },
    ]
  },
  {
    path: '/activity',
    component: Layout,
    name: 'activity',
    alwaysShow: true,
    meta: {title: '活动中心', icon: 'activity'},
    children: [
      {
        path: 'activityIndex',
        name: 'activityIndex',
        component: activityIndex,
        meta: {title: '活动列表'}
      },
      {
        path: 'addActivity',
        name: 'addActivity',
        hidden: true,
        component: addActivity,
        meta: {title: '添加活动'}
      },
      {
        path: 'editActivity',
        name: 'editActivity',
        hidden: true,
        component: editActivity,
        meta: {title: '编辑活动'}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'user',
    alwaysShow: true,
    meta: {title: '用户中心', icon: 'user'},
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: userList,
        meta: {title: '用户列表'}
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        hidden: true,
        component: userDetail,
        meta: {title: '用户详情'}
      },
    ]
  },
  {
    path: '/CommentCenter',
    component: Layout,
    name: 'CommentCenter',
    alwaysShow: true,
    meta: {title: '评论中心', icon: 'CommentCenter'},
    children: [
      {
        path: 'Report',
        name: 'Report',
        component: Report,
        meta: {title: '举报列表'}
      },
    ]
  },
  {
    path: '/Points',
    component: Layout,
    name: 'Points',
    alwaysShow: true,
    meta: {title: '积分道具', icon: 'Points'},
    children: [
      {
        path: 'PointsList',
        name: 'PointsList',
        component: PointsList,
        meta: {title: '发放列表'}
      },
      {
        path: 'Issue',
        name: 'Issue',
        component: Issue,
        hidden: true,
        meta: {title: '积分发放'}
      },
    ]
  }*/
]
const createRouter = () => new Router({
  mode: 'history',
  routes: constantRoutes
})
// 路由合并
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

router.$addRoutes = (params) => {
  //动态路由时生效
  router.matcher = new Router({mode: 'history'}).matcher
  router.addRoutes(params)
}

export default router
