<!-- 公告列表 -->
<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form size="mini" :inline="true">
                <el-form-item label="发布类型">
                    <el-select v-model="formList.itype" @change="getList">
                        <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="itype_name" label="发布类型"></el-table-column>
            <el-table-column label="公告类型">
                <template scope="scope"><el-col v-html="scope.row.notice_type_name"></el-col></template>
            </el-table-column>
            <el-table-column label="公告内容" width="100">
                <template scope="scope">
                    <el-button type="primary" size="mini" @click="handleListShowNotice(scope.row)" plain>查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="生效时间">
                <template scope="scope"><el-col>{{scope.row.istime}} <span class="blue">至</span> {{scope.row.ietime}}</el-col></template>
            </el-table-column>
            <el-table-column prop="state_name" label="生效状态" width="100"></el-table-column>
            <el-table-column label="操作" width="220">
                <template scope="scope">
                    <el-button type="warning" size="mini" v-if="scope.row.state <= 1" @click="handleListCancel(scope.row)" plain>按账号撤消</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.state <= 1" @click="handleListCancelAll(scope.row)" plain>全部撤消</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.state > 1" @click="handleListDel(scope.row)" icon="el-icon-delete" plain></el-button>
                </template>
            </el-table-column>
            <el-table-column label="查询撤消" width="120">
                <template scope="scope">
                    <el-button type="info" size="mini" v-if="scope.row.state <= 1" @click="handleListCancelShow(scope.row)" plain>已撤消账号</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="撤消账号" :visible.sync="cancelFormVisible" :close-on-click-modal="false" width="600px">
            <el-form size="mini" label-width="90px">
                <el-form-item label="输入账号" required>
                    <el-input type="textarea" v-model.trim="cancelForm.snbids" placeholder="输入网吧账号，逗号或回车隔开。"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelFormSnbids">确定</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
import { Loading } from 'element-ui';
import api from '../../api/api';
import comm from '../../common/js/comm';
import opts from '../../common/js/options';

const o_state = {0: '预约中', 1: '正在生效', 2: '已过期', 3: '已撤消', 4: '生效失败'};
const o_notice_types = {1: '<span class="green">提醒公告</span>', 2: '<span class="red">停服公告</span>'};
const o_itypes = function() {
    let itypes = {};
    for (var i = 0; i < opts.noticeType.length; i++) {
        itypes[opts.noticeType[i].value] = opts.noticeType[i].label;
    }

    return itypes;
}();

export default {
    data() {
            return {
                optionsType: comm.mergeArr([{ value: 0, label: '不限' }], opts.noticeType),
                formList: {
                    itype: 0,
                    page: 1,
                    page_limit: 1000
                },

                listLoading: false,
                list: [],

                cancelFormVisible: false,
                cancelForm: {
                    snbids: '',
                    id: ''
                }
            }
        },
        methods: {
            getList() {
                this.listLoading = true;

                let params = Object.assign({}, this.formList);
                api.get('/announcement/general/', params).then((res) => {
                    this.listLoading = false;
                    if(res.code !== 0) {
                        this.$message({message: res.message, type: 'warning'});
                        return;
                    }

                    this.list = this.setList(res.data || []);
                });
            },
            setList(list) {
                for (var i = 0; i < list.length; i++) {
                    let item = list[i];
                    
                    item.itype_name = o_itypes[item.itype];
                    item.notice_type_name = o_notice_types[item.notice_type];
                    item.state_name = o_state[item.state];
                    item.istime = comm.getDate(item.istime);
                    item.ietime = comm.getDate(item.ietime);
                }
                return list;
            },
            cancelFormSnbids() {
                if(!this.cancelForm.snbids) {
                    this.$message({message: '请输入网吧账号', type: 'warning'});
                    return;
                }

                let loading = Loading.service({ fullscreen: true, text: '稍等，正在撤消中...' });
                api.put('/announcement/general/', {
                    id: this.cancelForm.id,
                    idel: 1, // 1-撤销，2-删除
                    snbids: comm.setIds(this.cancelForm.snbids)
                }).then((res) => {
                    loading.close();
                    if(res.code !== 0) {
                        this.$message({message: res.message, type: 'warning'});
                        return;
                    }

                    this.cancelFormVisible = false;
                    this.$message({message: '撤消操作成功', type: 'success'});
                    this.getList();
                });
            },
            handleListShowNotice(row) {
                this.$alert(row.scontent.replace(/\n/g, '<br />'), '查看公告内容', {
                    dangerouslyUseHTMLString: true, 
                    customClass: 'el-message-notice-content',
                    confirmButtonText: '关闭'
                });
            },
            handleListDel(row) {
                this.$confirm('确认删除该公告？', '删除提示', {type: 'warning'}).then(() => {
                    api.put('/announcement/general/', {
                        id: row.id,
                        idel: 2 // 1-撤销，2-删除
                    }).then((res) => {
                        if(res.code !== 0) {
                            this.$message({message: res.message, type: 'warning'});
                            return;
                        }

                        this.$message({message: '删除成功', type: 'success'});
                        this.getList();
                    });
                });
            },
            handleListCancelAll(row) {
                this.$confirm('确认全部撤消该公告？', '撤消提示', {type: 'warning'}).then(() => {
                    let loading = Loading.service({ fullscreen: true, text: '稍等，正在撤消中...' });
                    api.put('/announcement/general/', {
                        id: row.id,
                        idel: 1, // 1-撤销，2-删除
                        snbids: ''
                    }).then((res) => {
                        loading.close();
                        if(res.code !== 0) {
                            this.$message({message: res.message, type: 'warning'});
                            return;
                        }

                        this.$message({message: '全部撤消操作成功', type: 'success'});
                        this.getList();
                    });
                });
            },
            handleListCancel(row) {
                this.cancelFormVisible = true;
                this.cancelForm.snbids = '';
                this.cancelForm.id = row.id;
            },
            handleListCancelShow(row) {
                api.get('/announcement/snbid/', {id: row.id, state: 1}).then((res) => {
                    if(res.code !== 0) {
                        this.$message({message: res.message, type: 'warning'});
                        return;
                    }

                    if(!res.data || !res.data.length) {
                        this.$message({message: '没有已撤消账号', type: 'info'});
                        return;
                    }

                    this.$alert(res.data.join(','), '已撤消账号', {
                        customClass: 'el-message-notice-content',
                        confirmButtonText: '关闭'
                    });
                });
            }
        },
        mounted() {
            this.getList();
        }
}
</script>
<style lang="scss">
.el-message-notice-content {
    width: 600px;
    .el-message-box__message {
        width: 100%;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        word-wrap: break-word;
        word-break:break-all;
    }
}
</style>