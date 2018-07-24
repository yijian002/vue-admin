<!-- 应用配置 -->
<template>
	<section>
		<el-tabs type="card" style="height: 200px; margin-top: 20px;">
            <el-tab-pane label="配置清单">
            	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form size="mini" :inline="true">
                        <el-form-item label="配置项">
                            <el-select v-model="formConfigList.sitem">
                            	<el-option :key="optionsDef.value" :label="optionsDef.label" :value="optionsDef.value"></el-option>
			                    <el-option v-for="item in optionsItems" :key="item.sitem" :label="item.sitem" :value="item.sitem"></el-option>
			                </el-select>
                        </el-form-item>
                        <el-form-item><el-button type="primary" icon="el-icon-search" @click="getListConfig">查询</el-button></el-form-item>
                        <el-form-item><el-button type="success" size="mini" icon="el-icon-plus" @click="handleAddConfig">添加配置项</el-button></el-form-item>
                    </el-form>
                </el-col>

                 <el-table :data="listConfig" highlight-current-row v-if="listConfigShow" v-loading="listConfigLoading" style="width: 100%;">
                    <el-table-column prop="sitem" label="配置项"></el-table-column>
                    <el-table-column prop="sname" label="配置名称"></el-table-column>
                    <el-table-column prop="iinserttime" label="生成时间"></el-table-column>
                    <el-table-column prop="throw_count" label="投放网吧"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                            <el-button type="danger" size="mini" v-if="!scope.row.throw_count" @click="handleDeleteConfig(scope.row)" icon="el-icon-delete" plain></el-button>
                        </template>
                    </el-table-column>
                </el-table>
        	</el-tab-pane>

        	<el-tab-pane label="投放配置">
            	<el-form size="mini" label-width="100px" class="el-form-medium" style="width: 600px; margin-top: 10px;">
		            <el-form-item label="配置项" required>
		                <el-select v-model="formLaunch.sitem">
		                    <el-option v-for="item in optionsItems" :key="item.sitem" :label="item.sitem" :value="item.sitem"></el-option>
		                </el-select>
		            </el-form-item>

		            <el-form-item label="配置值" required>
		            	<el-input type="textarea" v-model.trim="formLaunch.content" placeholder=""></el-input>
		            </el-form-item>

		            <el-form-item label="投放类型" required>
		                <el-select v-model="formLaunch.throw_type" @change="handleChangeShowthrowTip">
		                    <el-option v-for="item in optionsThorwType" :key="item.value" :label="item.label" :value="item.value"></el-option>
		                </el-select>

		                <span class="red f12" style="margin-left: 20px;">{{optionsThorwTypeTip}}</span>
		            </el-form-item>

		            <el-form-item v-show="formLaunchShowSnbids">
		            	<el-input type="textarea" v-model.trim="formLaunch.snbids" placeholder="输入网吧账号，逗号或回车隔开。"></el-input>
		            </el-form-item>

		            <el-form-item><el-button size="medium" type="primary" style="margin-top: 10px;" @click="handleAddLaunch">确认投放</el-button></el-form-item>
		        </el-form>
        	</el-tab-pane>

            <el-tab-pane label="查询或撤消">
            	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form size="mini" :inline="true">
                        <el-form-item label="配置项">
                            <el-select v-model="formRevoke.sitem">
                            	<el-option :key="optionsDef.value" :label="optionsDef.label" :value="optionsDef.value"></el-option>
                                <el-option v-for="item in optionsItems" :key="item.sitem" :label="item.sitem" :value="item.sitem"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="输入账号">
                            <el-input v-model="formRevoke.snbids" :maxlength="40" placeholder="不输入账号则为全国查询"></el-input>
                        </el-form-item>
                        <el-form-item><el-button type="primary" icon="el-icon-search" @click="getListRevoke">查询</el-button></el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="listRevoke" highlight-current-row v-if="listLoadingRevokeShow" v-loading="listLoadingRevoke" @selection-change="selsRevokesChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="网吧账号"></el-table-column>
                    <el-table-column prop="sitem" label="配置项"></el-table-column>
                    <el-table-column prop="sname" label="配置名称"></el-table-column>
                    <el-table-column prop="iinserttime" label="投放时间"></el-table-column>
                    <el-table-column prop="inman" label="投放人"></el-table-column>
                    <el-table-column label="配置值" width="120">
                        <template scope="scope">
                            <el-button type="primary" size="mini" @click="handleListShowRevokeContent(scope.row)" plain>查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar" v-if="listLoadingRevokeShow">
                    <el-button type="danger" size="mini" @click="removeRevokes" :disabled="this.selsRevoke.length===0">撤消选中</el-button>
                    <el-button type="warning" size="mini" @click="removeAllRevokes" icon="el-icon-warning">撤消所有查询结果</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeRevoke" :current-page="formRevoke.page" :page-size="formRevoke.page_limit" :total="formRevokeTotal" style="float:right;"></el-pagination>
                </el-col>
        	</el-tab-pane>
        </el-tabs>

		<el-dialog title="添加配置项" :visible.sync="addFormConfigVisible" :close-on-click-modal="false" width="350px">
		    <el-form size="small" :model="addFormConfig" label-width="90px">
	            <el-form-item label="配置项" required>
	            	<el-input v-model.trim="addFormConfig.sitem"></el-input>
                </el-form-item>
		        <el-form-item label="配置名称">
		        	<el-input v-model.trim="addFormConfig.sname"></el-input>
		        </el-form-item>
		        <el-form-item class="el-dialog-form-textarea" label="备注">
			        <el-input type="textarea" v-model.trim="addFormConfig.sremark"></el-input>
			    </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button size="small" type="primary" @click="addConfig">提交</el-button>
		    </div>
		</el-dialog>

		<el-dialog title="投放结果" :visible.sync="addLaunchResultVisible" :close-on-click-modal="false" width="800px">
		    <el-row>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">成功：{{addLaunchResultSuccess.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="addLaunchResultSuccess.join('\n')"></el-input>
				</el-col>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">失败：{{addLaunchResultFail.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="addLaunchResultFail.join('\n')"></el-input>
				</el-col>
			</el-row>
		</el-dialog>

	</section>
</template>

<script>
	import { Loading } from 'element-ui';
	import api from '../../api/api';
	import comm from '../../common/js/comm';

	export default {
		data() {
			return {
				optionsDef: {label: '不限', value: ''},
				optionsItems: [],
				formConfigList: {
					sitem: '',
					page: 1,
					page_limit: 1000
				},
				listConfigShow: false,
				listConfigLoading: false,
				listConfig: [],
				addFormConfigVisible: false,
				addFormConfig: {sitem: '', sname: '', sremark: ''},

				optionsThorwType: [
					{label: '账号', value: 1, show_snbids: true},
					{label: '全国', value: 3, show_snbids: false, smark: '（只针对全国当前所有的账号投放，新增账号除外）'}
				],
				optionsThorwTypeTip: '',
				formLaunchShowSnbids: true,
				formLaunch: {
					throw_type: 1,
					snbids: '',
					sitem: '',
					content: ''
				},

				addLaunchResultVisible: false,
				addLaunchResultSuccess: [],
				addLaunchResultFail: [],
				listLoadingRevokeShow: false,
				listLoadingRevoke: false,
				listRevoke: [],
				selsRevoke: [],
				formRevoke: {
					sitem: '',
	                snbids: '',
	                page: 1,
	                page_limit: 20
	            },
	            formRevokeTotal: 0
			}
		},
		methods: {
			initConfigMenu() {
				api.get('/app_configuration/configuration/menu/').then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.optionsItems = res.data || [];
				});
			},
			getListConfig() {
				let params = Object.assign({}, this.formConfigList);

				this.listConfigShow = true;
				this.listConfigLoading = true;
				api.get('/app_configuration/configuration/', params).then((res) => {
					this.listConfigLoading = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					let list = res.data || [];
					for (var i = 0; i < list.length; i++) {
						list[i].iinserttime = comm.getDate(list[i].iinserttime);
					}

					this.listConfig = list;
				});
			},
			handleAddConfig() {
				this.addFormConfigVisible = true;
				this.addFormConfig = {sitem: '', sname: '', sremark: ''};
			},
			addConfig() {
				let params = Object.assign({}, this.addFormConfig);
				if(!params.sitem) {
					this.$message({message: '请输入配置项', type: 'warning'});
					return;
				}

				api.post('/app_configuration/configuration/', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$message({message: '添加成功！查看请点击查询。', type: 'success'});
					this.addFormConfigVisible = false;
					this.initConfigMenu();
				});
			},
			handleDeleteConfig(row) {
				this.$confirm('确认删除此配置项吗？', '删除提示', {type: 'warning'}).then(() => {
					api.del('/app_configuration/configuration/', {sitem: row.sitem}).then((res) => {
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '删除成功', type: 'success'});
						this.getListConfig();
					});
				});
			},
			handleChangeShowthrowTip() {
				let throw_type = this.formLaunch.throw_type;

				for (var i = 0; i < this.optionsThorwType.length; i++) {
					if(this.optionsThorwType[i].value === throw_type) {
						this.optionsThorwTypeTip = this.optionsThorwType[i].smark || '';
						this.formLaunchShowSnbids = this.optionsThorwType[i].show_snbids;
						break;
					}
				}

				this.formLaunch.snbids = '';
			},
			handleAddLaunch() {
				let params = Object.assign({}, this.formLaunch);
				if(!params.sitem) {
					this.$message({message: '请选择配置项', type: 'warning'});
					return;
				}

				if(!params.content) {
					this.$message({message: '请输入配置值', type: 'warning'});
					return;
				}

				if(params.throw_type === 1 && !params.snbids) {
					this.$message({message: '请输入网吧账号', type: 'warning'});
					return;
				}

				if(params.snbids) {
					params.snbids = comm.setIds(params.snbids);	
				}

				this.$confirm('确认要进行投放吗？', '投放提示', {type: 'warning'}).then(() => {
					api.post('/app_configuration/throw_configuration/', params).then((res) => {
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '投放提交成功', type: 'success'});					

						if(params.throw_type === 1) { // 按账号投放
							this.addLaunchResultVisible = true;
							this.addLaunchResultSuccess = res.data.success || [];
							this.addLaunchResultFail = res.data.failed || [];
						}

						this.formLaunch.snbids = '';
						this.formLaunch.sitem = '';
						this.formLaunch.content = '';
					});
				});
			},
			getListRevoke() {
				let params = Object.assign({}, this.formRevoke);

				this.listLoadingRevokeShow = true;
				this.listLoadingRevoke = true;
				api.get('/app_configuration/throw_configuration/', params).then((res) => {
					this.listLoadingRevoke = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					let list = res.data || [];
					for (var i = 0; i < list.length; i++) {
						list[i].iinserttime = comm.getDate(list[i].iinserttime);
					}

					this.listRevoke = list;
					this.formRevokeTotal = res.total;
				});
			},
			handleListShowRevokeContent(row) {
				let loading = Loading.service({ fullscreen: true, text: '正在获取配置值...' });

				api.get('/app_configuration/throw_configuration/content', {contentid: row.contentid}).then((res) => {
					loading.close();
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$alert(res.data, '配置值', {customClass: 'el-message-strategy'});
				});
			},
			removeRevokes() {
				let ids = this.selsRevoke.map(item => item.id);

	        	this.$confirm('确认撤消选中的投放？', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.put('/app_configuration/throw_configuration/', {ids: ids.join(',')}).then((res) => {
						this.listLoadingRevoke = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '撤消成功', type: 'success'});
						this.getListRevoke();
					});
				});
			},
			removeAllRevokes() {
				let params = {
	        		sitem: this.formRevoke.sitem,
	        		snbids: this.formRevoke.snbids
	        	};

	        	if(!params.sitem) {
	        		this.$message({message: '请选择配置项才可以进行撤消操作！', type: 'warning'});
	        		return;
	        	}

	        	this.$confirm('该操作会撤消目前查询条件下所有结果数据，请确认查询结果符合你的要求！', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.del('/app_configuration/throw_configuration/', params).then((res) => {
						this.listLoadingRevoke = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '撤消查询结果操作成功', type: 'success'});
						this.getListRevoke();
					});
				});
			},
			handleCurrentChangeRevoke(val) {
	        	this.formRevoke.page = val;
				this.getListRevoke();
	        },
			selsRevokesChange(sels) {
	            this.selsRevoke = sels;
	        }
		},
		mounted() {
			this.initConfigMenu();
		}
	}
</script>