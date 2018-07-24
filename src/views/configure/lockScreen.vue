<!-- 锁屏界面 -->
<template>
	<section>
		<el-tabs type="card" style="height: 200px; margin-top: 20px;">
        	<el-tab-pane label="投放配置">
            	<el-form size="mini" label-width="140px" class="el-form-medium" style="width: 650px; margin-top: 10px;">
            		<el-form-item label="锁屏选择" required>
            			<el-checkbox :disabled="desks_game.disabled" v-model="desks_game.checked" @change="handleChangeDesks(desks_game)">{{desks_game.label}}</el-checkbox>
            			<el-checkbox :disabled="desks_win.disabled" v-model="desks_win.checked" @change="handleChangeDesks(desks_win)">{{desks_win.label}}</el-checkbox>
		            </el-form-item>

		            <el-form-item label="默认桌面" required>
		                <el-select v-model="formLockscreen.default">
		                    <el-option v-if="desks_game.checked" :key="desks_game.value" :label="desks_game.label" :value="desks_game.value"></el-option>
		                    <el-option v-if="desks_win.checked" :key="desks_win.value" :label="desks_win.label" :value="desks_win.value"></el-option>
		                    <el-option v-if="!desks_game.disabled && !desks_win.disabled" :key="desks_custom.value" :label="desks_custom.label" :value="desks_custom.value"></el-option>
		                </el-select>
		            </el-form-item>

		            <el-form-item label="优先排列" required>
		                <el-select v-model="formLockscreen.first">
		                    <el-option v-if="desks_game.checked" :key="desks_game.value" :label="desks_game.label" :value="desks_game.value"></el-option>
		                    <el-option v-if="desks_win.checked" :key="desks_win.value" :label="desks_win.label" :value="desks_win.value"></el-option>
		                    <el-option v-if="!desks_game.disabled && !desks_win.disabled" :key="desks_custom.value" :label="desks_custom.label" :value="desks_custom.value"></el-option>
		                </el-select>
		            </el-form-item>

		            <el-form-item label="网吧是否可更改" required>
		            	<el-radio v-model="formLockscreen.lock" :label="0">可以</el-radio>
  						<el-radio v-model="formLockscreen.lock" :label="1">不可以</el-radio>
		            </el-form-item>

		            <el-form-item label="投放类型" required>
		                <el-select v-model="formLockscreen.ltype" @change="handleChangeShowthrowTip">
		                    <el-option v-for="item in optionsThorwType" :key="item.value" :label="item.label" :value="item.value"></el-option>
		                </el-select>
		            </el-form-item>

		            <el-form-item v-show="formLaunchShowSnbids">
		            	<el-input type="textarea" v-model.trim="formLockscreen.snbids" placeholder="输入网吧账号，逗号或回车隔开。"></el-input>
		            </el-form-item>

		            <el-form-item><el-button size="medium" type="primary" style="margin-top: 10px;" @click="handleAddLaunch">确认投放</el-button></el-form-item>
		        </el-form>
        	</el-tab-pane>

            <el-tab-pane label="查询或撤消">
            	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form size="mini" :inline="true">
                        <el-form-item label="默认桌面">
                            <el-select v-model="formRevoke.default">
                            	<el-option :key="optionsDef.value" :label="optionsDef.label" :value="optionsDef.value"></el-option>
                                <el-option :key="desks_game.value" :label="desks_game.label" :value="desks_game.value"></el-option>
		                    	<el-option :key="desks_win.value" :label="desks_win.label" :value="desks_win.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="输入账号">
                            <el-input v-model="formRevoke.snbid" :maxlength="40" placeholder="不输入账号则为全国查询"></el-input>
                        </el-form-item>
                        <el-form-item><el-button type="primary" icon="el-icon-search" @click="getListRevoke">查询</el-button></el-form-item>
                        <el-form-item><el-button type="info" icon="el-icon-document" @click="exportRevoke">导出查询结果</el-button></el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="listRevoke" highlight-current-row v-loading="listLoadingRevoke" @selection-change="selsRevokesChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="网吧账号"></el-table-column>
                    <el-table-column prop="desks" label="锁屏桌面"></el-table-column>
                    <el-table-column prop="default" label="默认桌面"></el-table-column>
                    <el-table-column prop="first" label="优先排列"></el-table-column>
                    <el-table-column prop="lock" label="网吧是否可更改"></el-table-column>
                    <el-table-column prop="lasttime" label="投放时间"></el-table-column>
                    <el-table-column prop="inman" label="投放人"></el-table-column>
                    <el-table-column prop="qdd" label="钱多多是否更改"></el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar">
                    <el-button type="danger" size="mini" @click="removeRevokes" :disabled="this.selsRevoke.length===0">撤消选中</el-button>
                    <el-button type="warning" size="mini" @click="removeAllRevokes" icon="el-icon-warning">撤消所有查询结果</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeRevoke" :current-page="formRevoke.page" :page-size="formRevoke.page_limit" :total="formRevokeTotal" style="float:right;"></el-pagination>
                </el-col>
        	</el-tab-pane>
        </el-tabs>


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
	import api from '../../api/api';
	import comm from '../../common/js/comm';

	export default {
		data() {
			return {
				optionsDef: {label: '不限', value: ''},
				desks_game: {checked: true, disabled: false, label: '游戏桌面', value: 'lol'},
				desks_win: {checked: true, disabled: false, label: 'Win桌面', value: 'classic'},
				desks_custom: {label: '顾客自主选择', value: ''},
				optionsThorwType: [
					{label: '账号', value: 1, show_snbids: true},
					{label: '全国', value: 3, show_snbids: false, smark: '（只针对全国当前所有的账号投放，新增账号除外）'}
				],
				optionsThorwTypeTip: '',
				formLaunchShowSnbids: true,
				formLockscreen: {
					ltype: 1,
					default: 'lol',
					first: 'lol',
					lock: 0,
					snbids: ''
				},
				addLaunchResultVisible: false,
				addLaunchResultSuccess: [],
				addLaunchResultFail: [],
				formRevoke: {
	                snbid: '',
	                default: '',
	                page: 1,
	                page_limit: 20
	            },
	            formRevokeTotal: 0,
				listLoadingRevoke: false,
				listRevoke: [],
				selsRevoke: []

			}
		},
		methods: {
			handleChangeDesks(item) {
				if(item.checked) {
					this.desks_game.disabled = false;
					this.desks_win.disabled = false;
				}
				else {
					this.desks_game.disabled = this.desks_game.checked
					this.desks_win.disabled = this.desks_win.checked;
				}

				this.formLockscreen.first = this.formLockscreen.default = this.desks_game.checked ? this.desks_game.value : this.desks_win.value;
			},
			handleChangeShowthrowTip() {
				let ltype = this.formLockscreen.ltype;

				for (let i = 0; i < this.optionsThorwType.length; i++) {
					if(this.optionsThorwType[i].value === ltype) {
						this.optionsThorwTypeTip = this.optionsThorwType[i].smark || '';
						this.formLaunchShowSnbids = this.optionsThorwType[i].show_snbids;
						break;
					}
				}

				this.formLockscreen.snbids = '';
			},
			handleAddLaunch() {
				let params = Object.assign({}, this.formLockscreen);

				if(params.ltype === 1 && !params.snbids) {
					this.$message({message: '请输入网吧账号', type: 'warning'});
					return;
				}

				if(params.snbids) {
					params.snbids = comm.setIds(params.snbids);	
				}

				params.desks = [];
				if(this.desks_game.checked) {
					params.desks.push(this.desks_game.value);
				}
				if(this.desks_win.checked) {
					params.desks.push(this.desks_win.value);
				}
				params.desks = params.desks.join(',');

				this.$confirm('确认要进行投放吗？', '投放提示', {type: 'warning'}).then(() => {
					api.post('/lockscreen/strategy/', params).then((res) => {
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '投放提交成功', type: 'success'});
						this.formLockscreen.snbids = '';
						
						if(params.ltype === 1) {
							this.addLaunchResultVisible = true;
							this.addLaunchResultSuccess = res.data.success || [];
							this.addLaunchResultFail = res.data.failed || [];
						}

						this.getListRevoke();
					});
				});
			},
			findRevokeDeskLabel(key) {
				if(this.desks_game.value === key) {
					return this.desks_game.label;
				}

				if(this.desks_win.value === key) {
					return this.desks_win.label;
				}

				return key;
			},
			getListRevoke() {
				let params = Object.assign({}, this.formRevoke);

				this.listLoadingRevoke = true;
				api.get('/lockscreen/strategy/', params).then((res) => {
					this.listLoadingRevoke = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					let list = res.data || [],
						item;
					for (let i = 0; i < list.length; i++) {
						item = list[i];

						item.qdd = item.qdd ? '是' : '-';
						item.lock = item.lock === 0 ? '可以' : '不可以';
						item.default = this.findRevokeDeskLabel(item.default);
						item.first = this.findRevokeDeskLabel(item.first);
						item.lasttime = comm.getDate(item.lasttime);

						if(item.desks) {
							item.desks = item.desks.split(',');
							for (let i = 0; i < item.desks.length; i++) {
								item.desks[i] = this.findRevokeDeskLabel(item.desks[i]);
							}
							item.desks = item.desks.join('|');
						}
					}

					this.listRevoke = list;
					this.formRevokeTotal = res.total;
				});
			},
			removeRevokes() {
				let ids = this.selsRevoke.map(item => item.id);

	        	this.$confirm('确认撤消选中的投放？', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.put('/lockscreen/strategy/', {ids: ids}).then((res) => {
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
	        		default: this.formRevoke.default,
	        		snbid: this.formRevoke.snbid
	        	};

	        	if(!params.default) {
	        		this.$message({message: '请选择默认桌面项才可以进行撤消操作！', type: 'warning'});
	        		return;
	        	}

	        	this.$confirm('该操作会撤消目前查询条件下所有结果数据，请确认查询结果符合你的要求！', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.del('/lockscreen/strategy/', params).then((res) => {
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
			exportRevoke() {
				let params = {
	        		default: this.formRevoke.default,
	        		snbid: this.formRevoke.snbid
	        	};

	        	api.gourl('/lockscreen/strategy/export/', params);
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
			this.getListRevoke();
		}
	}
</script>
