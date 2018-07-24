<!-- 公告发布 -->
<template>
    <section>
        <el-form size="mini" label-width="100px" class="el-form-medium" style="width: 600px; margin-top: 20px;">
            <el-form-item label="发布类型" required>
                <el-select v-model="formNotice.itype" @change="showNoticeType">
                    <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公告类型" required>
                <el-radio-group v-model="formNotice.notice_type">
                    <el-tooltip v-if="showNoticeType_1" popper-class="el-tooltip-red" effect="light" content="弹窗提示，用户可以继续操作" placement="left">
                        <el-radio :label="1">提醒公告</el-radio>
                    </el-tooltip>
                    <el-tooltip v-if="showNoticeType_2" popper-class="el-tooltip-red" effect="light" content="覆盖窗口，用户不可以再操作" placement="right">
                        <el-radio :label="2">停服公告</el-radio>
                    </el-tooltip>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="编辑公告" required>
                <el-input type="textarea" v-model.trim="formNotice.scontent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="发布时间" required>
                <el-date-picker v-model="formNotice.datetime" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="medium" type="primary" style="margin-top: 10px;" @click="handleAddNotice">发布公告</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>
<script>
import api from '../../api/api';
import opts from '../../common/js/options';
import comm from '../../common/js/comm';

export default {
    data() {
            return {
                optionsType: opts.noticeType,
                showNoticeType_1: true,
                showNoticeType_2: true,
                formNotice: {
                    itype: '',
                    notice_type: '',
                    scontent: '',
                    datetime: []
                }
            }
        },
        methods: {
            initDatetime() {
                var datetime = new Date().getTime(),
                    tomorrow = comm.getDate(datetime + (24*60*60*1000), 'YMD');

                this.formNotice.datetime = [datetime, new Date(tomorrow + ' 00:00:00').getTime()];
            },
            showNoticeType(val) {
                let notices = this.optionsType;

                for (var i = 0; i < notices.length; i++) {
                    if(notices[i].value === val) {
                        let types = notices[i].types;
                        this.showNoticeType_1 = types.indexOf(1) >= 0;
                        this.showNoticeType_2 = types.indexOf(2) >= 0;
                        this.formNotice.notice_type = types[0];
                        break;
                    }
                }
            },
            handleAddNotice() {
                if(!this.formNotice.itype) {
                    this.$message({message: '请选择发布类型', type: 'warning'});
                    return;
                }

                if(!this.formNotice.scontent) {
                    this.$message({message: '请输入公告内容', type: 'warning'});
                    return;
                }
                
                if(!this.formNotice.datetime) {
                    this.$message({message: '请选择发布时间', type: 'warning'});
                    return;
                }

                let params = {
                    itype: this.formNotice.itype,
                    notice_type: this.formNotice.notice_type,
                    scontent: this.formNotice.scontent,
                    istime: parseInt(this.formNotice.datetime[0]/1000),
                    ietime: parseInt(this.formNotice.datetime[1]/1000)
                };

                this.$confirm('请确认发布公告', '提示').then(() => {
                    this.addNotice(params);
                });
            },
            addNotice(params) {
                api.post('/announcement/general/', params).then((res) => {
                    if(res.code !== 0) {
                        this.$message({message: res.message, type: 'warning'});
                        return;
                    }

                    this.$message({message: '发布成功', type: 'success'});
                    this.reset();
                });
            },
            reset() {
                this.formNotice = {
                    itype: '',
                    notice_type: '',
                    scontent: '',
                    datetime: ''
                };
                this.showNoticeType_1 = true;
                this.showNoticeType_2 = true;
            }
        },
        mounted() {
            this.initDatetime();
        }
}
</script>