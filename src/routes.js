import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'

// 投放管理
import launchUpdatePackage from './views/launch/updatePackage.vue'
import launchRevoke from './views/launch/launchRevoke.vue'
import launchVoiceResource from './views/launch/voiceResource.vue'

// 配置管理
import configControlUrlParams from './views/configure/controlUrlParams.vue'

// 系统管理
import systemUsers from './views/system/users.vue'

let routes = [{
    path: '/login',
    component: Login,
    name: '',
    hidden: true
}, {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
}, {
    path: '/index', // 初始页
    hidden: true,
    redirect: { path: '/launchUpdatePackage' }
}, {
    path: '/',
    component: Home,
    name: '投放管理',
    iconCls: 'el-icon-sold-out',
    children: [
        { path: '/launchUpdatePackage', component: launchUpdatePackage, name: '更新包清单' },
        { path: '/launchRevoke', component: launchRevoke, name: '投放/撤销' },
        { path: '/launchVoiceResource', component: launchVoiceResource, name: '语音资源' },
    ]
}, {
    path: '/',
    component: Home,
    name: '配置管理',
    iconCls: 'el-icon-document',
    children: [
        { path: '/configControlUrlParams', component: configControlUrlParams, name: '控制台URL参数' },
    ]
}, {
    path: '/',
    component: Home,
    name: '系统管理',
    iconCls: 'el-icon-setting',
    children: [
        { path: '/systemUsers', component: systemUsers, name: '用户管理' },
    ]
}, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
}];

export default routes;
