<!-- 投放/撤销 -->
<template>
    <section>
        <el-tabs type="card" style="height: 200px; margin-top: 20px;">

            <el-tab-pane label="投 放">
                <el-row :gutter="20">
                    <el-col :span="6" class="line-right">
                        <h3>按账号投放更新包</h3>
                        <el-form size="mini" :model="formPackage" ref="packageForm" :label-position="'left'" label-width="86px">
                            <el-form-item label="更新包类型">
                                <el-select v-model="formPackage.itype" @change="updateFormPackageVersion">
                                    <el-option v-for="item in options.packageType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="版本号">
                                <el-select v-model="formPackage.szipname" v-loading="formPackageVersionLoading">
                                    <el-option v-for="item in formPackageVersion" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="更新类型" v-show="formPackage.itype==3">
                                <el-select v-model="formPackage.force_type">
                                    <el-option v-for="item in options.updateType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-col>
                                <el-checkbox label="强制更新" name="force_update" v-model="formPackage.force_update"></el-checkbox>
                                <el-checkbox label="紧急更新" name="urgency" v-model="formPackage.urgency" style="margin-left: 40px;"></el-checkbox>
                            </el-col>
                            <el-input type="textarea" v-model="formPackage.id_list" placeholder="输入网吧账号，逗号隔开。" style="margin-top: 20px;"></el-input>

                            <el-form-item label="更新包备注" style="margin-top:20px;">
                               <el-input v-model="formPackage.sremark"></el-input>
                            </el-form-item>
                            <el-button size="medium" type="primary" style="margin-top: 20px;" @click="addPackage">确认投放</el-button>
                        </el-form>
                    </el-col>
 
                    <el-col :span="18">
                        <el-row>
                        	<el-col :span="12"><h3>默认更新包</h3></el-col>
                        	<el-col :span="12" style="text-align: right;"><el-button type="success" size="mini" icon="el-icon-plus" @click="handleAddPackage">新增默认包</el-button></el-col>
                        </el-row>
                        <el-table :data="listUpdatePackage" highlight-current-row v-loading="listLoadingUpdatePackage" style="width: 100%;">
                            <el-table-column prop="itype_name" label="更新包类型"></el-table-column>
                            <el-table-column prop="szipname" label="版本号"></el-table-column>
                            <el-table-column prop="sdefault" label="投放人"></el-table-column>
                            <el-table-column prop="iinserttime" label="投放时间"></el-table-column>
                            <el-table-column label="操作" width="120">
                                <template scope="scope">
                                    <el-button type="primary" size="mini" @click="handleUpdatePackage(scope.$index, scope.row)" plain>更改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="查询或撤销">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form size="mini" :inline="true">
                        <el-form-item label="更新包类型">
                            <el-select v-model="formRevoke.itype" @change="updateFormRevokeVersion">
                                <el-option v-for="item in options.packageTypes" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本号">
                            <el-select v-model="formRevoke.szipname" v-loading="formRevokeVersionLoading">
                                <el-option v-for="item in formRevokeVersion" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input v-model="formRevoke.snbid" :maxlength="40"></el-input>
                        </el-form-item>
                        <el-form-item><el-button type="primary" icon="el-icon-search" @click="formRevoke.page=1;getListRevoke()">查询</el-button></el-form-item>
                        <el-form-item><el-button type="info" icon="el-icon-document" @click="exportRevoke">导出查询结果</el-button></el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="listRevoke" highlight-current-row v-loading="listLoadingRevoke" @selection-change="selsRevokesChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="账号"></el-table-column>
                    <el-table-column prop="itype_name" label="更新包类型"></el-table-column>
                    <el-table-column prop="inman" label="投放人"></el-table-column>
                    <el-table-column prop="szipname" label="版本号"></el-table-column>
                    <el-table-column prop="iinserttime" label="投放时间"></el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar">
                    <el-button type="danger" size="mini" @click="removeRevokes" :disabled="this.selsRevoke.length===0">撤销选中</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeRevoke" :current-page="formRevoke.page" :page-size="formRevoke.page_limit" :total="formRevoke.total" style="float:right;"></el-pagination>
                </el-col>
            </el-tab-pane>
        </el-tabs>


        <!--修改更新包-->
		<el-dialog title="设置默认包" :visible.sync="updatePackageFormVisible" :close-on-click-modal="false" width="400px">
		    <el-form size="mini" :model="updatePackageForm" ref="updatePackageForm" label-width="95px">
		        <el-form-item label="更新包类型"><b>{{updatePackageForm.itype_name}}</b></el-form-item>
		        <el-form-item label="版本号">
		            <el-select v-model="updatePackageForm.szipname">
                        <el-option v-for="item in updatePackageFormVersion" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
		        </el-form-item>
		        <el-form-item label="备注">{{updatePackageForm.sremark}}</el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="UpdatePackage">保存</el-button>
		    </div>
		</el-dialog>

		<!--修改更新包-->
		<el-dialog title="投放结果" :visible.sync="addPackageResultVisible" :close-on-click-modal="false" width="800px">
		    <el-row>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">成功：{{addPackageResultSuccess.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="addPackageResultSuccess.join('\n')"></el-input>
				</el-col>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">失败：{{addPackageResultFail.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="addPackageResultFail.join('\n')"></el-input>
				</el-col>
			</el-row>
		</el-dialog>

		<!--新增默认包-->
		<el-dialog title="上传" :visible.sync="addFormPackageVisible" :close-on-click-modal="false" width="350px">
		    <el-form size="small" :model="addFormPackage" ref="addFormPackage" label-width="95px">
		        <el-form-item label="更新包类型" prop="itype" required>
		            <el-select v-model="addFormPackage.itype" @change="updateAddFormPackageVersion">
		                <el-option v-for="item in options.packageType" :key="item.value" :label="item.label" :value="item.value">
		                </el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="版本号" prop="szipname" required>
		            <el-select v-model="addFormPackage.szipname" @change="handleChangeFormPackageVersion">
                        <el-option v-for="item in addFormPackageVersion" :key="item.szipname" :label="item.szipname" :value="item.szipname"></el-option>
                    </el-select>
		        </el-form-item>
		        <el-form-item label="备注"><el-col>{{addFormPackage.sremark}}</el-col></el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="addDefaultPackage">保存</el-button>
		    </div>
		</el-dialog>

    </section>
</template>

<script type="text/javascript">
	import { Loading } from 'element-ui';
	import comm from '../../common/js/comm';
	import opts from '../../common/js/options';
	import api from '../../api/api';

	let app = {
		getPackageVersion(itype, idefault, callback) { // 更新包下拉菜单 0-非默认包， 1-默认包
			api.get('/throw_strategy/package_menu/', {itype: itype, idefault: idefault}).then((res) => {
				if(res.code !== 0) {
					callback([]);
					return;
				}

				callback(res.data || []);
			});
		}
	};
	
	export default {
	    data() {
	        return {
	            options: {
	                packageTypes: opts.packageTypes,
	                packageType: opts.packageType,
	                updateType: opts.forceType
	            },
	            formPackage: {
	                itype: '', // 更新包类型
	                szipname: '', // 版本号
	                id_list: '', // id_list为网吧账号
	                force_type: 0, // 是否立即生效：0 普通更新，1 重启更新, 2 提示更新
	                force_update: false, // 是否强制更新：0-否，1-是
	                urgency: false, // 是否紧急：0-否，1-是
	                sremark: ''
	            },
	            formRevoke: {
	                itype: 0,
	                szipname: '',
	                snbid: '',
	                total: 0,
	                page: 1,
	                page_limit: 20
	            },
	            formPackageVersion: [], // 投放更新包-版本号
	            formPackageVersionLoading: false,
	            formRevokeVersion: [], // 查询撤销-版本号
	            formRevokeVersionLoading: false,

	            listPackage: {page: 1, page_limit: 100},
	            listLoadingUpdatePackage: false,
	            listUpdatePackage: [],

	            addPackageResultVisible: false,
	            addPackageResultSuccess: [],
	            addPackageResultFail: [],

	            updatePackageFormVisible: false,
	            updatePackageForm: {},
	            updatePackageFormVersion: [],

	            addFormPackageVisible: false,
	            addFormPackage: {},
	            addFormPackageVersion: [],

	            listLoadingRevoke: false,
	            listRevoke: [],
	            selsRevoke: []
	        }
	    },
	    methods: {
	    	getListPackage() { // 获取默认更新包简略信息列表
	    		let params = Object.assign({}, this.listPackage);

				this.listLoadingUpdatePackage = true;
				api.get('/throw_strategy/strategy_package/', params).then((res) => {
					this.listLoadingUpdatePackage = false;

					res.data = res.data || [];
					for (var i = 0; i < res.data.length; i++) {
						let item = res.data[i];
						item.itype_name = opts.findPackageName(item.itype);
						item.throw_count = item.idefault ? '默认包' : item.throw_count;
						item.iinserttime = comm.getDate(item.iinserttime);
					}

					this.listUpdatePackage = res.data;
				});
			},
			addPackage() { // 按账号投放更新包
				let params = Object.assign({}, this.formPackage);

				params.force_update = params.force_update ? 1 : 0;
				params.urgency = params.urgency ? 1 : 0;
				params.id_list = comm.setIds(params.id_list);

				if(!params.itype) {
					this.$message({message: '请选择更新包类型', type: 'warning'});
					return;
				}

				if(!params.szipname) {
					this.$message({message: '请选择版本号', type: 'warning'});
					return;
				}

				if(!params.id_list) {
					this.$message({message: '请输入投放的网吧账号，逗号隔开', type: 'warning'});
					return;
				}

				this.$confirm('确认投放更新包吗？', '投放提示', {type: 'warning'}).then(() => {
					let loading = Loading.service({ fullscreen: true, text: '提交投放更新...' });
					api.post('/throw_strategy/strategy_package/', params).then((res) => {
						loading.close();
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						if(this.$refs.packageForm !== undefined) {
							this.$refs.packageForm.resetFields();
						}
						else {
							this.formPackage = {
				                itype: '',
				                szipname: '',
				                id_list: '',
				                force_type: 0,
				                force_update: false,
				                urgency: false,
				                sremark: ''
				            };
						}

						this.addPackageResultVisible = true;
						this.addPackageResultSuccess = res.data.success || [];
						this.addPackageResultFail = res.data.failed || [];
						this.getListRevoke();
					});
				});
			},
			updateFormPackageVersion() {
				this.formPackageVersionLoading = true;
				app.getPackageVersion(this.formPackage.itype, 0, (list) => {
					this.formPackage.szipname = '';
					this.formPackageVersionLoading = false;
					this.formPackageVersion = list;
				});
			},
			handleUpdatePackage(idx, row) {
				this.updatePackageFormVisible = true;
				this.updatePackageForm = row;

				app.getPackageVersion(row.itype, 0, (list) => {
					this.updatePackageFormVersion = list;
				});
			},
			handleAddPackage() {
				this.addFormPackageVisible = true;
				this.addFormPackage = {
					itype: opts.packageType[0].value,
					szipname: '',
					sremark: ''
				};
				this.updateAddFormPackageVersion();
			},
			updateAddFormPackageVersion() {
				api.get('/throw_strategy/zipfile/', {page: 1, page_limit: 1000, itype: this.addFormPackage.itype}).then((res) => {
					if(res.code !== 0) {
						return;
					}

					let list = [];
					for (var i = 0; i < res.data.length; i++) {
						if(!res.data[i].idefault) {
							list.push(res.data[i]);
						}
					}

					this.addFormPackage.szipname = '';
					this.addFormPackage.sremark = '';
					this.addFormPackageVersion = list;
				});
			},
			handleChangeFormPackageVersion() {
				for (var i = 0; i < this.addFormPackageVersion.length; i++) {
					if(this.addFormPackageVersion[i].szipname === this.addFormPackage.szipname) {
						this.addFormPackage.sremark = this.addFormPackageVersion[i].sremark; // 同步显示包备注
						break;
					}
				}
			},
			addDefaultPackage() {
				let params = Object.assign({}, this.addFormPackage);
				if(!params.szipname) {
					this.$message({message: '请选择版本号', type: 'warning'});
					return;
				}

				params.is_new = 1; // 新增默认包
				delete params.sremark;
				api.put('/throw_strategy/strategy_package/', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.addFormPackageVisible = false;
					this.$message({message: '新增默认包成功', type: 'success'});
					this.getListPackage();
				});
			},
			UpdatePackage() { // 更新投放包
				var params = {
					szipname: this.updatePackageForm.szipname, 
					itype: this.updatePackageForm.itype,
					is_new: 0
				};

				api.put('/throw_strategy/strategy_package/', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.updatePackageFormVisible = false;
					this.$message({message: '设置成功', type: 'success'});
					this.getListPackage();
				});
			},
			updateFormRevokeVersion() {
				this.formRevokeVersionLoading = true;
				app.getPackageVersion(this.formRevoke.itype, '', (list) => {
					this.formRevoke.szipname = '';
					this.formRevokeVersionLoading = false;
					this.formRevokeVersion = list;
				});
			},
	        getListRevoke() { // 查询投放记录
	        	let params = Object.assign({}, this.formRevoke);

	        	this.listLoadingRevoke = true;
				api.get('/throw_strategy/record/', params).then((res) => {
					this.listLoadingRevoke = false;
					this.formRevoke.total = res.total;

					res.data = res.data || [];
					for (var i = 0; i < res.data.length; i++) {
						let item = res.data[i];
						item.itype_name = opts.findPackageName(item.itype);
						item.iinserttime = comm.getDate(item.iinserttime);
					}

					this.listRevoke = res.data;
				});
	        },
	        exportRevoke() { // 导出投放记录
	        	let params = {
	        		itype: this.formRevoke.itype,
	        		szipname: this.formRevoke.szipname,
	        		snbid: this.formRevoke.snbid
	        	};

	        	api.gourl('/throw_strategy/record/export/', params);
	        },
	        handleCurrentChangeRevoke(val) {
	        	this.formRevoke.page = val;
				this.getListRevoke();
	        },
	        removeRevokes() { // 撤销投放
	        	let ids = this.selsRevoke.map(item => item.id);

	        	this.$confirm('正在撤销'+ ids.length +'个账号的投放，点击确定继续撤销', '撤销提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.put('/throw_strategy/record/', {id: ids}).then((res) => {
						this.listLoadingRevoke = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '撤销成功', type: 'success'});
						this.getListRevoke();
					});
				});
	        },
	        selsRevokesChange(sels) {
	            this.selsRevoke = sels;
	        }
	    },
	    mounted() {
	    	this.getListPackage();
	    	this.getListRevoke();
	    	this.updateFormRevokeVersion();
	    }
	}
</script>

<style>
.el-textarea__inner {
    height: 100px;
}
.el-textarea__inner {
	width: 90%;
	height: 270px;
	margin: 0 auto;
}
.line-right {
    border-right: 1px solid #e4e7ed;
}
</style>
