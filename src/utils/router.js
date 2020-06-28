/* 系统设置*/
import addRole from '@/views/system/role/addRole/index'
import addAcc from '@/views/system/account/add/index'
import editUser from '@/views/system/account/edit/index'
import editRole from '@/views/system/role/editRole/index'
import addExhibition from '@/views/gather/exhibition/addExhibition'
import editExhibition from '@/views/gather/exhibition/editExhibition'
import recommendationDetails from '@/views/gather/recommendation/details'
import addInformation from '@/views/celebrity/information/addInformation'
import editInformation from '@/views/celebrity/information/editInformation'
import Album from '@/views/celebrity/information/album'
import addCommodity from '@/views/celebrity/commodity/addCommodity'
import editCommodity from '@/views/celebrity/commodity/editCommodity'
import userDetail from '@/views/user/UserDetail'
import Issue from '@/views/Points/Issue'
import addActivity  from '@/views/activity/components/addActivity'
import editActivity  from '@/views/activity/components/editActivity'
import exhibitionView  from '@/views/gather/exhibition/exhibitionView'

const addRouterSplice = {
  addRole: {
    path: 'addRole',
    name: 'addRole',
    hidden: true,
    component: addRole,
    meta: {title: '添加角色', icon: 'example'}
  },
  editRole: {
    path: 'editRole',
    name: 'editRole',
    hidden: true,
    component: editRole,
    meta: {title: '编辑角色', icon: 'example'}
  },
  editUser: {
    path: 'editUser',
    name: 'editUser',
    hidden: true,
    component: editUser,
    meta: {title: '编辑账号', icon: 'example'}
  },
  addAcc: {
    path: 'addAcc',
    name: 'addAcc',
    hidden: true,
    component: addAcc,
    meta: {title: '添加账号', icon: 'example'}
  },
  addExhibition: {
    name: 'addExhibition',
    path: 'addExhibition',
    hidden: true,
    component: addExhibition,
    meta: {title: '添加展览', icon: 'gather'}
  },
  editExhibition: {
    name: 'editExhibition',
    path: 'editExhibition',
    hidden: true,
    component: editExhibition,
    meta: {title: '编辑展览', icon: 'gather'}
  },
  recommendationDetails: {
    name: 'recommendationDetails',
    path: 'recommendationDetails',
    hidden: true,
    component: recommendationDetails,
    meta: {title: '推荐详情', icon: 'gather'}
  },
  addInformation: {
    path: 'addInformation',
    name: 'addInformation',
    component: addInformation,
    hidden: true,
    meta: {title: '添加大咖', icon: 'celebrity'}
  },
  editInformation: {
    path: 'editInformation',
    name: 'editInformation',
    component: editInformation,
    hidden: true,
    meta: {title: '编辑大咖', icon: 'celebrity'}
  },
  Album: {
    path: 'album',
    name: 'album',
    component: Album,
    hidden: true,
    meta: {title: '大咖相册', icon: 'celebrity'}
  },
  addCommodity: {
    path: 'addCommodity',
    name: 'addCommodity',
    component: addCommodity,
    hidden: true,
    meta: {title: '添加商品', icon: 'celebrity'}
  },
  editCommodity: {
      path: 'editCommodity',
      name: 'editCommodity',
      component: editCommodity,
      hidden: true,
      meta: {title: '编辑商品', icon: 'celebrity'}
    },
  exhibitionView: {
      path: 'exhibitionView',
      name: 'exhibitionView',
      component: exhibitionView,
      hidden: true,
      meta: {title: '查看召集',}
    },
  addActivity: {
    path: 'addActivity',
    name: 'addActivity',
    hidden: true,
    component: addActivity,
    meta: {title: '添加活动'}
  },
  editActivity: {
    path: 'editActivity',
    name: 'editActivity',
    hidden: true,
    component: editActivity,
    meta: {title: '编辑活动'}
  },
  userDetail: {
    path: 'userDetail',
    name: 'userDetail',
    hidden: true,
    component: userDetail,
    meta: {title: '用户详情'}
  },
  Issue: {
    path: 'Issue',
    name: 'Issue',
    component: Issue,
    hidden: true,
    meta: {title: '积分发放'}
  }
}

export default addRouterSplice
