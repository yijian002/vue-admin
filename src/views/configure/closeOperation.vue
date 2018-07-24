<!-- 关闭操作 -->
<template>
	<section>
		<el-tabs type="card" style="height: 200px; margin-top: 20px;">
            <el-tab-pane label="关闭操作">
            	<el-form size="mini" label-width="100px" class="el-form-medium" style="width: 600px; margin-top: 20px;">
			        <el-form-item label="输入账号" required>
				        <el-input type="textarea" v-model="formClose.snbids" placeholder="输入网吧账号，逗号或回车隔开。"></el-input>
				    </el-form-item>

				    <el-form-item label="关闭原因" required>
						<el-checkbox-group v-model="formClose.resion">
							<el-col><el-checkbox label="1">1. 占用cpu，导致机器卡</el-checkbox></el-col>
							<el-col><el-checkbox label="2">2. 引起蓝屏或机器重启</el-checkbox></el-col>
							<el-col><el-checkbox label="3">3. 网吧要求暂时关闭，排查问题</el-checkbox></el-col>
							<el-col><el-checkbox label="4">4. 网民不明白怎么操作</el-checkbox></el-col>
							<el-col><el-checkbox label="5">5. windows桌面悬浮切换圆盘容易误点，导致网民切换桌面后不知道怎么回去</el-checkbox></el-col>
							<el-col><el-checkbox label="6">6. windows桌面悬浮切换圆盘太大，占地方</el-checkbox></el-col>
							<el-col><el-checkbox label="7">7. 游戏桌面上有广告，不想要</el-checkbox></el-col>
							<el-col><el-checkbox label="8">8. 网吧有自己的定制桌面</el-checkbox></el-col>
							<el-col><el-checkbox label="9">9. 太花哨了，好难看</el-checkbox></el-col>
							<el-col><el-checkbox label="10">10. 没有什么用，不能帮助网吧提升收入</el-checkbox></el-col>
							<el-col><el-checkbox label="11" @change="showFormOther=!showFormOther">11. 其他</el-checkbox></el-col>
							<el-col class="el-form-closeoperation-other" v-show="showFormOther">
								<el-input type="textarea" v-model="formClose.other" placeholder="输入其他关闭原因"></el-input>
							</el-col>
						</el-checkbox-group>
				    </el-form-item>

			        <el-form-item><el-button size="medium" type="primary" style="margin-top: 10px;" @click="addClose">提交</el-button></el-form-item>
			    </el-form>
        	</el-tab-pane>

            <el-tab-pane label="查询与撤消">
            	<el-form size="mini" label-width="100px" class="el-form-mini" style="width: 600px; margin-top: 20px;">
			        <el-form-item label="输入账号">
				        <el-input type="textarea" v-model="query.snbids" placeholder="输入网吧账号，逗号或回车隔开。"></el-input>
				    </el-form-item>
				    <el-form-item style="text-align: right;"><el-button type="primary" icon="el-icon-search" @click="getListClose()">查询</el-button></el-form-item>
				</el-form>

				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="query.total">
					<el-form size="mini" :inline="true" >
                        <el-form-item><span style="margin-right: 10px;">关闭网吧共{{query.total}}家</span><el-button type="info" icon="el-icon-document" @click="exportListClose">导出结果</el-button></el-form-item>
                    </el-form>
                </el-col>

                <el-table highlight-current-row :data="listClose" v-if="listClose.length || listLoadingClose" v-loading="listLoadingClose" @selection-change="selsCloseChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="网吧账号"></el-table-column>
                    <el-table-column prop="sreason" label="关闭原因"></el-table-column>
                    <el-table-column prop="iinserttime" label="关闭时间"></el-table-column>
                    <el-table-column prop="inman" label="操作人"></el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar" v-if="listClose.length">
                    <el-button type="danger" size="mini" @click="cancelListClose" :disabled="this.selsClose.length===0">撤消选中</el-button>
                </el-col>

        	</el-tab-pane>
        </el-tabs>

		<el-dialog :title="closeResultTitle" :visible.sync="closeResultVisible" :close-on-click-modal="false" width="800px">
		    <el-row>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">成功：{{closeResultSuccess.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="closeResultSuccess.join('\n')"></el-input>
				</el-col>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">失败：{{closeResultFail.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="closeResultFail.join('\n')"></el-input>
				</el-col>
			</el-row>
		</el-dialog>

	</section>
</template>

<script>
	import api from '../../api/api';
	import comm from '../../common/js/comm';

	export default {
		data() {
			return {
				showFormOther: false,
				formClose: {
					snbids: '',
					resion: [],
					other: ''
				},

				closeResultTitle: '',
				closeResultVisible: false,
				closeResultSuccess: [],
				closeResultFail: [],

				query: {snbids: '', total: 0},
				listClose: [],
				listLoadingClose: false,
				selsClose: []
			}
		},
		methods: {
			addClose() {
				let params = {
					snbids: comm.setIds(this.formClose.snbids),
					sreason: this.formClose.resion,
					message: this.formClose.resion.indexOf('11') >= 0 ? this.formClose.other : ''
				};

				if(!params.snbids) {
					this.$message({message: '请输入网吧账号', type: 'warning'});
					return;
				}

				if(!params.sreason.length) {
					this.$message({message: '请选择关闭原因', type: 'warning'});
					return;
				}

				api.post('/close/desktop/', params).then((res) => {
                    if(res.code !== 0) {
                        this.$message({message: res.message, type: 'warning'});
                        return;
                    }

                    this.closeResultTitle = '关闭操作';
                    this.closeResultVisible = true;
                    this.closeResultSuccess = res.data.success || [];
					this.closeResultFail = res.data.failed || [];
					this.showFormOther = false;
                    this.formClose = {snbids: '', resion: [], other: ''};
                });
			},
			restList() {
				this.query.total = 0;
                this.listClose = [];
			},
			getListClose() {
				this.listLoadingClose = true;
				this.restList();

				let snbids = comm.setIds(this.query.snbids);
				api.get('/close/desktop/', {snbids:  snbids ? snbids.join(',') : ''}).then((res) => {
					this.listLoadingClose = false;
                    if(res.code !== 0) {
                        this.$message({message: res.message, type: 'warning'});
                        return;
                    }

                    if(!res.total) {
                    	this.$message({message: '没有查到此账号'});
                    	return;
                    }

                    let list = res.data || [];
                    for (var i = 0; i < list.length; i++) {
                    	list[i].iinserttime = comm.getDate(list[i].iinserttime);
                    }

                    this.query.total = res.total;
                    this.listClose = list;
                });
			},
			cancelListClose() {
				let ids = this.selsClose.map(item => item.id);

				this.$confirm('确定继续撤消选中项？', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingClose = true;

					api.del('/close/desktop/', {ids: ids.join(',')}).then((res) => {
						this.listLoadingClose = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.closeResultTitle = '撤消结果';
	                    this.closeResultVisible = true;
	                    this.closeResultSuccess = res.data.success || [];
						this.closeResultFail = res.data.failed || [];
						
						this.restList();
					});
				});
			},
			exportListClose() {
				let snbids = comm.setIds(this.query.snbids);
				api.gourl('/close/desktop/export', {snbids: snbids ? snbids.join(',') : ''});
			},
			selsCloseChange(sels) {
				this.selsClose = sels;
			}
		},
		mounted() {
		}
	}
</script>
<style>
.el-form-closeoperation-other .el-textarea .el-textarea__inner {
	height: 80px;
}
</style>