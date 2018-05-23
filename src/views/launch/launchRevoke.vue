<template>
    <section>
        <el-tabs type="card" style="height: 200px; margin-top: 20px;">

            <el-tab-pane label="投 放">
                <el-row :gutter="20">
                    <el-col :span="6" class="line-right">
                        <h3>按帐号投放更新包</h3>
                        <el-form :label-position="'left'" label-width="86px">
                            <el-form-item label="更新包类型">
                                <el-select v-model="formPackage.itype">
                                    <el-option v-for="item in options.packageType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="版本号">
                                <el-select v-model="formPackage.szipname">
                                    <el-option v-for="item in options.version" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="更新类型">
                                <el-select v-model="formPackage.force_type">
                                    <el-option v-for="item in options.updateType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-col>
                                <el-checkbox label="强制更新" name="force_update" v-model="formPackage.force_update"></el-checkbox>
                                <el-checkbox label="紧急更新" name="urgency" v-model="formPackage.urgency" style="margin-left: 40px;"></el-checkbox>
                            </el-col>
                            <el-input type="textarea" v-model="formPackage.sremark" style="margin-top: 20px;"></el-input>
                            <div>更新包备注：</div>
                            <el-button size="medium" type="primary" style="margin-top: 20px;" @click="addPackage">确认投放</el-button>
                        </el-form>
                    </el-col>

                    <el-col :span="18">
                        <h3>默认更新包</h3>
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
                    <el-form size="small" :inline="true">
                        <el-form-item label="更新包类型">
                            <el-select v-model="formRevoke.itype">
                                <el-option v-for="item in options.packageTypes" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本号">
                            <el-select v-model="formRevoke.szipname">
                                <el-option v-for="item in options.version" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="帐号">
                            <el-input v-model="formRevoke.snbid" :maxlength="40"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="getListRevoke">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="listRevoke" highlight-current-row v-loading="listLoadingRevoke" @selection-change="selsRevokesChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="帐号"></el-table-column>
                    <el-table-column prop="itype_name" label="更新包类型"></el-table-column>
                    <el-table-column prop="inman" label="投放人"></el-table-column>
                    <el-table-column prop="szipname" label="版本号"></el-table-column>
                    <el-table-column prop="iinserttime" label="投放时间"></el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar">
                    <el-button type="danger" size="small" @click="removeRevokes" :disabled="this.selsRevoke.length===0">撤销选中</el-button>
                </el-col>
            </el-tab-pane>
        </el-tabs>


        <!--修改更新包-->
		<el-dialog title="设置默认包" :visible.sync="updatePackageFormVisible" :close-on-click-modal="false" width="30%">
		    <el-form :model="updatePackageForm" ref="updatePackageForm" label-width="95px">
		        <el-form-item label="更新包类型"><b>{{updatePackageForm.itype_name}}</b></el-form-item>
		        <el-form-item label="版本号">
		            <el-select v-model="updatePackageForm.szipname">
                        <el-option v-for="item in updatePackageFormVersion" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
		        </el-form-item>
		        <el-form-item label="备注">{{updatePackageForm.sremark}}</el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="UpdatePackage">保存</el-button>
		    </div>
		</el-dialog>

		<!--修改更新包-->
		<el-dialog title="投放结果" :visible.sync="addPackageResultVisible" :close-on-click-modal="false" width="50%">
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
    </section>
</template>

<script>
	import { Loading } from 'element-ui';
	// import util from '../../common/js/util'
	import opts from '../../common/js/options'
	import api from '../../api/api';
	
	export default {
	    data() {
	        return {
	            options: {
	                packageTypes: opts.packageTypes,
	                packageType: opts.packageType,
	                version: [],
	                updateType: opts.forceType
	            },
	            formPackage: {
	                itype: '', // 更新类型
	                szipname: '', // 版本号
	                id_list: '*', // id_list为网吧账号, '*'为全国投放
	                force_type: 0, // 是否立即生效：0 普通更新，1 重启更新, 2 提示更新
	                force_update: false, // 是否强制更新：0-否，1-是
	                urgency: false, // 是否紧急：0-否，1-是
	                sremark: ''
	            },
	            formRevoke: {
	                itype: 0,
	                szipname: '',
	                snbid: '',
	                page: 1,
	                page_limit: 100
	            },

	            listPackage: {
	            	page: 1,
	            	page_limit: 100
	            },
	            listLoadingUpdatePackage: false,
	            listUpdatePackage: [],

	            addPackageResultVisible: false,
	            addPackageResultSuccess: [],
	            addPackageResultFail: [],

	            updatePackageFormVisible: false,
	            updatePackageForm: {},
	            updatePackageFormVersion: [],

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

					for (var i = 0; i < res.data.length; i++) {
						res.data[i].itype_name = opts.findPackageName(res.data[i].itype);
						res.data[i].throw_count = res.data[i].idefault ? '默认包' : res.data[i].throw_count;
					}

					this.listUpdatePackage = res.data;
				});
			},
			addPackage() { // 按帐号投放更新包
				let params = Object.assign({}, this.formPackage);

				params.force_update = params.force_update ? 1 : 0;
				params.urgency = params.urgency ? 1 : 0;

				if(!params.itype) {
					this.$message({message: '请选择更新包类型', type: 'warning'});
					return;
				}

				if(!params.szipname) {
					this.$message({message: '请选择版本号', type: 'warning'});
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

						this.addPackageResultVisible = true;
						this.addPackageResultSuccess = res.data.success || [];
						this.addPackageResultFail = res.data.failed || [];
					});
				});
			},
			handleUpdatePackage(idx, row) {
				this.updatePackageFormVisible = true;
				this.updatePackageForm = row;
			},
			UpdatePackage() { // 更新投放包
				var _this = this,
					params = {szipname: this.updatePackageForm.szipname, itype: this.updatePackageForm.szipname};

				api.put('/throw_strategy/strategy_package/', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					_this.updatePackageFormVisible = false;
					_this.getListPackage();
				});
			},
	        getListRevoke() { // 查询投放记录
	        	let params = Object.assign({}, this.formRevoke);

	        	this.listLoadingRevoke = true;
				api.get('/throw_strategy/record/', params).then((res) => {
					this.listLoadingRevoke = false;

					for (var i = 0; i < res.data.length; i++) {
						res.data[i].itype_name = opts.findPackageName(res.data[i].itype);
					}

					this.listRevoke = res.data;
				});
	        },
	        removeRevokes() { // 撤销投放
	        	let ids = this.selsRevoke.map(item => item.id);

	        	this.$confirm('确认撤销选中的投放吗？', '撤销提示', {type: 'warning'}).then(() => {
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
	    }
	}
</script>

<style type="text/css">
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
