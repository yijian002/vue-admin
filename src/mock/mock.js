import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers } from './data/user';

export default {
    bootstrap() {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/sysmanage/login').reply(config => {
            let { tuser_account, tuser_pwd } = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.tuser_account === tuser_account && u.tuser_pwd === tuser_pwd) {
                            user = JSON.parse(JSON.stringify(u));
                            user.tuser_pwd = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, { code: 200, msg: '请求成功', user }]);
                    } else {
                        resolve([200, { code: 500, msg: '账号或密码错误' }]);
                    }
                }, 1000);
            });
        });

        // 系统用户组列表
        mock.onGet('/sysmanage/user_group/').reply(res => {
            let datas = {
                "code": 0,
                "message": "string",
                "total": 0,
                "page": 1,
                "page_limit": 20,
                "page_count": 1,
                "data": [{
                    "tgroup_id": 1,
                    "tgroup_name": "string",
                    "tmember_count": 0,
                    "tlast_time": 0,
                }]
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        // 系统用户列表
        mock.onGet('/sysmanage/user/').reply(res => {
            let datas = {
                "tuserid": 1,
                "code": 0,
                "message": "string",
                "total": 0,
                "page": 1,
                "page_limit": 20,
                "page_count": 1,
                "data": [{
                    "tuser_account": "string",
                    "tuser_name": "string",
                    "tgroup_id": "string",
                    "group_name": "string",
                    "tcreater": "string",
                    "tcreater_time": 0,
                    "tlogin_time": 0,
                }]
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        //查看更新包列表
        mock.onGet('/throw_strategy/zipfile/').reply(config => {
            let datas = {
                "code": 0,
                "message": "string",
                "total": 0,
                "page": 1,
                "page_limit": 20,
                "page_count": 1,
                "data": [{
                    "id": 1,
                    "itype": 3,
                    "szipname": "string",
                    "iinserttime": 0,
                    "sremark": 0,
                    "throw_count": 0,
                    "sfilepath": "",
                    "version": "version",
                    "idefault": 1
                }, {
                    "id": 2,
                    "itype": 3,
                    "szipname": "string",
                    "iinserttime": 0,
                    "sremark": 0,
                    "throw_count": 0,
                    "sfilepath": "",
                    "version": "version",
                    "idefault": 0
                }]
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });
        mock.onDelete('/throw_strategy/zipfile/').reply(config => {
            let datas = {
                "code": 0,
                "message": "string"
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        // 查看更新策略
        mock.onGet('/throw_strategy/strategy/').reply(res => {
            let codes = '{ "voice_server_program": { "package_name": "voice_4.8.0.1(2018.4.26.1204)", "package_data": [{ "file_name": "wxFetchLog.dll", "md5": "eb6e1adfa50eaffeaf438075b9049625", "path": "[CUR]/wxFetchLog.dll", "url": "http://filescdn.wxdesk.com//upfile/201804271506259391/wxFetchLog.dll", "runtype": 1, "level": 1, "version": "2018.3.23.1500" }, { "file_name": "wxVoiceServer.exe", "md5": "c61856115145c3386062f532361ec2d3", "path": "[CUR]/wxVoiceServer.exe", "url": "http://filescdn.wxdesk.com//upfile/201804271506259391/wxVoiceServer.exe", "runtype": 2, "level": 1, "version": "2018.4.26.1204" }, { "file_name": "wxVoiceServerLauncher.exe", "md5": "4d3ae1590ae59488aa34dcf8070d4433", "path": "[CUR]/wxVoiceServerLauncher.exe", "url": "http://filescdn.wxdesk.com//upfile/201804271506259391/wxVoiceServerLauncher.exe", "runtype": 2, "level": 1, "version": "2018.4.26.1204" }] } }';

            let datas = {
                "code": 0,
                "message": "string",
                "data": {
                    "sstrategy": codes,
                }
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        //获取默认更新包简略信息列表
        mock.onGet('/throw_strategy/strategy_package/').reply(config => {
            let datas = {
                "code": 0,
                "message": "string",
                "total": 0,
                "page_count": 0,
                "page": 1,
                "page_limit": 20,
                "data": [{
                    "id": 1,
                    "szipname": "szipname",
                    "sremark": "string",
                    "idefault": 1,
                    "itype": 1,
                    "sdefault": "string",
                    "iinserttime": 0,
                }]
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        //查询投放记录
        mock.onGet('/throw_strategy/record/').reply(config => {
            let datas = {
                "code": 0,
                "message": "string",
                "total": 0,
                "page_count": 0,
                "page": 1,
                "page_limit": 20,
                "data": [{
                    "id": 1,
                    "itype": 1,
                    "szipname": "string",
                    "snbid": "string",
                    "szoneid": "string",
                    "iinserttime": 0,
                    "sremark": "string",
                    "inman": "string",
                }, {
                    "id": 2,
                    "itype": 4,
                    "szipname": "string",
                    "snbid": "string",
                    "szoneid": "string",
                    "iinserttime": 0,
                    "sremark": "string",
                    "inman": "string",
                }]
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        //取语音资源列表
        mock.onGet('/throw_strategy/voice/').reply(config => {
            let datas = {
                "code": 0,
                "message": "string",
                "total": 10,
                "page": 1,
                "page_limit": 20,
                "page_count": 10,
                "total_size": 10,
                "data": [{
                    "id": 1,
                    "filename": "string",
                    "isize": 0,
                }]
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

        //删除语音资源
        mock.onDelete('/throw_strategy/voice/').reply(config => {
            let datas = {
                "code": 2,
                "message": "删除错误演示",
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, datas]);
                }, 1000);
            });
        });

    }
};
