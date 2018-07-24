<!-- 更新包清单 -->
<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
		    <el-form size="mini" :inline="true">
		        <el-form-item label="更新包类型">
		            <el-select v-model="optionsValue">
		                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item>
		            <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
		        </el-form-item>
		        <el-form-item>
		            <el-button type="success" icon="el-icon-plus" @click="handleListAdd">添加更新包</el-button>
		        </el-form-item>
		    </el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="itype_name" label="更新包类型"></el-table-column>
			<el-table-column prop="szipname" label="版本号"></el-table-column>
			<el-table-column prop="iinserttime" label="上传时间"></el-table-column>
			<el-table-column prop="sremark" label="备注"></el-table-column>
			<el-table-column prop="throw_count" label="已投网吧"></el-table-column>
			<el-table-column label="操作" width="280">
				<template scope="scope">
					<el-button type="info" size="mini" @click="handleListExport(scope.$index, scope.row)" :disabled="scope.row.idefault ? true : false" plain>导出</el-button>
					<el-button type="info" size="mini" @click="handleListDownload(scope.$index, scope.row)" plain>下载</el-button>
					<el-button type="primary" size="mini" @click="handleListShowStrategy(scope.$index, scope.row)" plain>策略</el-button>
					<el-button type="danger" size="mini" @click="handleListDel(scope.$index, scope.row)" icon="el-icon-delete" plain></el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="page_limit" :total="total" style="float:right;"></el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="上传" :visible.sync="addFormVisible" :close-on-click-modal="false" width="350px">
		    <el-form size="small" :model="addForm" :rules="addFormRules" ref="addForm" label-width="95px">
		        <el-form-item label="更新包类型" prop="itype" required>
		            <el-select v-model="addForm.itype">
		                <el-option v-for="item in optionsAdd" :key="item.value" :label="item.label" :value="item.value">
		                </el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="版本号" prop="szipname" required><el-input v-model.trim="addForm.szipname"></el-input></el-form-item>
		        <el-form-item label="上传更新包" required>
		            <el-upload class="upload-demo" action="/throw_strategy/zipfile/" :limit="1" :on-success="handleFileSuccess" :on-error="handleFileError" :file-list="addFileList" accept=".zip">
		                <el-button  type="primary">立即上传<i class="el-icon-upload el-icon--right"></i></el-button>
		            </el-upload>
		        </el-form-item>
		        <el-form-item label="备注">
		            <el-input v-model="addForm.sremark" :maxlength="20"></el-input>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="addList">保存</el-button>
		    </div>
		</el-dialog>


		<el-dialog title="更新策略配置" :visible.sync="updateStrategyVisible" :close-on-click-modal="false" width="1000px">
		  	<el-table :data="updateStrategyList" highlight-current-row style="width: 100%;">
				<el-table-column prop="filename" label="文件名"></el-table-column>
				<el-table-column prop="version" label="版本号"></el-table-column>
				<el-table-column prop="iupok_txt" label="上传状态"></el-table-column>
				<el-table-column label="默认路径">
					<template scope="scope">
						<el-select size="mini" v-model="scope.row.defaultpath">
			                <el-option v-for="item in optionsDefaultpath" :key="item" :label="item" :value="item">
			                </el-option>
			            </el-select>
		            </template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-select size="mini" v-model="scope.row.irun">
			                <el-option :key="1" label="仅下载" :value="1"></el-option>
			                <el-option :key="2" label="下载运行" :value="2"></el-option>
			            </el-select>
		            </template>
				</el-table-column>
				<el-table-column label="优先级" width="150">
					<template scope="scope">
						<el-select size="mini" v-model="scope.row.ilevel">
			                <el-option :key="2" label="不重要" :value="2"></el-option>
			                <el-option :key="1" label="重要" :value="1"></el-option>
			                <el-option :key="3" label="延时下载" :value="3"></el-option>
			            </el-select>
		            </template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitUpdateStrategy">提交更新包</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { Loading } from 'element-ui';
	import comm from '../../common/js/comm';
	import opts from '../../common/js/options';
	import api from '../../api/api';

	export default {
		data() {
			return {
				options: opts.packageTypes,
				optionsAdd: opts.packageType,
				optionsDefaultpath: opts.defaultpath,
				optionsValue: 0,

				list: [],
				total: 0,
				page: 1,
				page_limit: 20,
				listLoading: false,

				// 增加更新包
				addFormVisible: false,
				addForm: {},
				addFormRules: {
					szipname: [{required: true, message: '请输入版本号', trigger: 'blur'}]
				},
				addFileList: [],
				addFileTag: '',

				// 更新策略包
				updateStrategyVisible: false,
				updateStrategyList: [],
				updateStrategyInfoid: '' // 更新包序号
			}
		},
		methods: {
			getList() {
				let params = {page: this.page, page_limit: this.page_limit, itype: this.optionsValue};

				this.listLoading = true;
				api.get('/throw_strategy/zipfile/', params).then((res) => {
					this.listLoading = false;
					this.total = res.total;

					res.data = res.data || [];
					for (var i = 0; i < res.data.length; i++) {
						let item = res.data[i];
						item.itype_name = opts.findPackageName(item.itype);
						item.throw_count = item.idefault ? '默认包' : item.throw_count;
						item.iinserttime = comm.getDate(item.iinserttime);
					}

					this.list = res.data;
				});
			},
			queryList() {
				this.page = 1;
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
			handleListDel(idx, row) {
				this.$confirm('确认删除该更新包吗？', '删除提示', {type: 'warning'}).then(() => {
					this.listLoading = true;
					api.del('/throw_strategy/zipfile/', {id: row.id}).then((res) => {
						this.listLoading = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '删除成功', type: 'success'});
						this.getList();
					});
				});
			},
			handleListAdd() {
				this.addFormVisible = true;
				this.addFileList = [];
				this.addFileTag = '';
				this.addForm = {
					szipname: '', // 更新包名
					tag: '', // 上传文件后，后端返回的zip文件标识
					itype: opts.packageType[0].value,
					sremark: ''
				};
			},
			handleFileError(err) {
				this.$message({message: '上传失败 [' + err.status + ']', type: 'error'});
			},
			handleFileSuccess(res) {
				if(res.code !== 0) {
					this.$message({message: res.message, type: 'error'});
					return;
				}
				// this.addFileList = [res.data.tag];
				this.addFileTag = res.data.tag;
			},
			addList() {
				this.$refs.addForm.validate((valid) => {
					if(!valid) {
						return;
					}

					let params = Object.assign({}, this.addForm);
					if(!params.szipname) {
						this.$message({message: '请填写版本号', type: 'warning'});
						return;
					}

					params.tag = this.addFileTag;
					if(!params.tag) {
						this.$message({message: '请上传更新包', type: 'warning'});
						return;
					}

					let loading = Loading.service({ fullscreen: true, text: '正在保存更新包...' });
					api.post('/throw_strategy/zipfile/', params).then((res) => {
						loading.close();
						if(res.code !== 0 && res.code !== 5003) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						if(res.code === 5003) {
							this.$message({message: res.message});
						}

						let iupok_status = {1: '成功', 2: '失败'};
						res.data = res.data || [];
						for (var i = 0; i < res.data.length; i++) {
							res.data[i].iupok_txt = iupok_status[res.data[i].iupok];
							res.data[i].szipname = this.addForm.szipname;
						}

						this.addFormVisible = false;
						this.updateStrategyVisible = true; // 显示更新策略内容
						this.updateStrategyList = res.data;
						this.updateStrategyInfoid = res.infoid;
					});
				});
			},
			submitUpdateStrategy() {
				let _this = this,
					params = {infoid: this.updateStrategyInfoid, strategy: []},
					is_run = false;
				for (var i = 0; i < this.updateStrategyList.length; i++) {
					let {smd5, irun, ilevel, defaultpath} = this.updateStrategyList[i];
					params.strategy[i] = {smd5: smd5, irun: irun, ilevel: ilevel, defaultpath: defaultpath};
					
					if(!is_run && irun === 2) {
						is_run = true;
					}
				}

				function update() {
					api.put('/throw_strategy/strategy/', params).then((res) => {
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}
						
						_this.updateStrategyVisible = false;
						_this.getList();
						_this.$message({message: '提交更新策略配置成功', type: 'success'});
					});
				}

				if([1, 3, 10].indexOf(this.addForm.itype) < 0) { // 控制台，客户端，播报端都必须要设置一个运行的文件 (ID定义：common/options.js)
					is_run = true;
				}

				if(!is_run) {
					this.$confirm('您没有设置下载后运行的文件，请确认是否继续提交！', '警告', {
						type: 'warning',
						confirmButtonText: '继续提交',
						cancelButtonText: '返回修改'
					}).then(() => {
						update();
					});
				}
				else {
					update();
				}				
			},
			handleListExport(idx, row) { // 导出策略
				api.gourl('/throw_strategy/export_record/', {infoid: row.id});
			},
			handleListDownload(idx, row) { // 下载策略
				if(!row.sfilepath) {
					this.$message({message: '没有找到下载文件', type: 'warning'});
					return;
				}

				window.location.href = row.sfilepath;
			},
			handleListShowStrategy(idx, row) { // 预览策略
				let loading = Loading.service({ fullscreen: true, text: '获取策略中...' });

				api.get('/throw_strategy/strategy/', {id: row.id}).then((res) => {
					loading.close();
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$alert(res.data.sstrategy, '查看更新包策略', {customClass: 'el-message-strategy'});
				});
			}
		},
		mounted() {
			this.getList();
		}
	}

</script>

<style lang="scss">
.el-button+.el-button {
	margin-left: 5px;
}
.el-message-strategy {
	width: 800px;
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