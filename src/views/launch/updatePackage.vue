<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
		    <el-form size="small" :inline="true">
		        <el-form-item>
		            更新包类型
		            <el-select v-model="optionsValue">
		                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item>
		            <el-button type="primary" @click="getList">查询</el-button>
		        </el-form-item>
		        <el-form-item>
		            <el-button type="success" @click="handleListAdd">添加更新包</el-button>
		        </el-form-item>
		    </el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="itype_name" label="更新包类型"></el-table-column>
			<el-table-column prop="version" label="版本号"></el-table-column>
			<el-table-column prop="iinserttime" label="上传时间"></el-table-column>
			<el-table-column prop="sremark" label="备注"></el-table-column>
			<el-table-column prop="throw_count" label="已投网吧"></el-table-column>
			<el-table-column label="操作" width="280">
				<template scope="scope">
					<el-button type="success" size="mini" @click="handleListExport(scope.$index, scope.row)" :disabled="scope.row.idefault ? true : false" plain>导出</el-button>
					<el-button type="success" size="mini" @click="handleListDownload(scope.$index, scope.row)" plain>下载</el-button>
					<el-button type="primary" size="mini" @click="handleListShowStrategy(scope.$index, scope.row)" plain>策略</el-button>
					<el-button type="danger" size="mini" @click="handleListDel(scope.$index, scope.row)" plain>删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page_limit" :total="total" style="float:right;"></el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="上传" :visible.sync="addFormVisible" :close-on-click-modal="false" width="30%">
		    <el-form size="small" :model="addForm" :rules="addFormRules" ref="addForm" label-width="95px">
		        <el-form-item label="更新包类型" required>
		            <el-select v-model="addForm.itype">
		                <el-option v-for="item in optionsAdd" :key="item.value" :label="item.label" :value="item.value">
		                </el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="版本号" required>
		            <el-input v-model="addForm.version" :maxlength="20"></el-input>
		        </el-form-item>
		        <el-form-item label="上传更新包" required>
		            <el-upload class="upload-demo" action="/throw_strategy/zipfile/" :limit="1" :on-success="handleFileSuccess" :on-error="handleFileError" :file-list="addFileList">
		                <el-button  type="primary">立即上传</el-button>
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



		<el-dialog title="更新策略配置" :visible.sync="updateStrategyVisible" :close-on-click-modal="false" width="70%">
		  	<el-table :data="updateStrategyList" highlight-current-row style="width: 100%;">
				<el-table-column prop="filename" label="文件名"></el-table-column>
				<el-table-column prop="version" label="版本号"></el-table-column>
				<el-table-column prop="iupok_txt" label="上传状态"></el-table-column>
				<el-table-column prop="filepath" label="默认路径"></el-table-column>
				<el-table-column label="操作" width="260">
					<template scope="scope">
						<el-button size="small" @click="">策略</el-button>
						<el-button type="danger" size="small" @click="">删除</el-button>
					</template>
				</el-table-column>
				<el-table-column label="优先级" width="260">
					<template scope="scope">
						<el-button size="small" @click="">策略</el-button>
						<el-button type="danger" size="small" @click="">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="">提交更新包</el-button>
			</div>
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
				options: opts.packageTypes,
				optionsAdd: opts.packageType,
				optionsValue: 0,

				list: [],
				total: 0,
				page: 1,
				page_limit: 20,
				listLoading: false,

				// 增加更新包
				addFormVisible: false,
				addForm: {version: ''},
				addFormRules: {
					version: [{required: true, message: '请输入版本号', trigger: 'blur'}]
				},
				addFileList: [],

				// 更新策略包
				updateStrategyVisible: false,
				updateStrategyList: []
			}
		},
		methods: {
			getList() {
				let params = {page: this.page, page_limit: this.page_limit, itype: this.optionsValue};

				this.listLoading = true;
				api.get('/throw_strategy/zipfile/', params).then((res) => {
					this.listLoading = false;
					this.total = res.total;
					for (var i = 0; i < res.data.length; i++) {
						res.data[i].itype_name = opts.findPackageName(res.data[i].itype);
						res.data[i].throw_count = res.data[i].idefault ? '默认包' : res.data[i].throw_count;
					}

					this.list = res.data;
				});
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
			handleListDel(idx, row) {
				this.$confirm('确认删除该更新包吗？', '删除提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					api.del('/throw_strategy/zipfile/', {id: row.id}).then((res) => {
						this.listLoading = false;
						this.$message({message: '删除成功', type: 'success'});
						this.getList();
					});
				});
			},
			handleListAdd() {
				this.addFormVisible = true;
				this.addFileList = [];
				this.addForm = {
					szipname: '', // 更新包名
					tag: '', // 上传文件后，后端返回的zip文件标识
					itype: opts.packageType[0].value,
					version: '',
					sremark: ''
				};
			},
			handleFileError(err, file, fileList) {
				this.$message({message: '上传失败 [' + err.status + ']', type: 'error'});
			},
			handleFileSuccess(res, file, fileList) {
				console.log(res, file, fileList)
			},
			addList() {
				this.$refs.addForm.validate((valid) => {
					if(!valid) {
						return;
					}

					let params = Object.assign({}, this.addForm);
					if(!params.version) {
						this.$message({message: '请填写版本号', type: 'warning'});
						return;
					}

					if(!params.tag) {
						this.$message({message: '请上传更新包', type: 'warning'});
						return;
					}

					api.post('/throw_strategy/zipfile/', params).then((res) => { // @todo
						let iupok_status = {1: '成功', 2: '失败'};
						for (var i = 0; i < res.data.length; i++) {
							res.data[i].iupok_txt = iupok_status[res.data[i].iupok];
							res.data[i].version = this.addForm.version;
						}

						this.addFormVisible = false;
						this.updateStrategyVisible = true;
						this.updateStrategyList = res.data;
					});
				});
			},
			handleListExport(idx, row) { // 导出策略
				window.location.href = '/throw_strategy/export_record/?infoid=' + row.id;
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
					this.$alert(res.data.sstrategy, '查看更新包策略', {customClass: 'el-message-strategy'});
				});
			}
		},
		mounted() {
			this.getList();
		}
	}

</script>

<style type="text/css">
.el-button+.el-button {
	margin-left: 5px;
}
.el-message-strategy {
	width: 800px;
}
</style>