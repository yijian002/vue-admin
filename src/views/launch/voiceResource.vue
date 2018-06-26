<!-- 语音资源 -->
<template>
	<section>
		<el-tabs type="card" @tab-click="tabClick" style="margin-top: 10px;">
		    <el-tab-pane v-for="item in tabs" :label="item.name"></el-tab-pane>
		</el-tabs>

		<el-col :span="24" class="toolbar">
			<el-row>
				<el-col :span="16" style="line-height: 32px;">当前个数：{{total_num}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前资源类型总大小：{{total_size}}
					<el-button type="success" size="mini" icon="el-icon-plus" @click="addFormVisible = true;addFileList=[];" style="margin-left: 40px;">添加语音</el-button>
				</el-col>
				<el-col :span="8" style="text-align: right;"><el-button type="warning" icon="el-icon-refresh" size="mini" @click="updateStrategyVisible=true"><b>更新策略</b></el-button></el-col>
			</el-row>
		</el-col>

		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="filename" label="文件名"></el-table-column>
			<el-table-column prop="isize" label="大小"></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button type="danger" size="mini" @click="delVoice(scope.$index, scope.row)" icon="el-icon-delete" plain></el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增界面-->
		<el-dialog title="添加语音" :visible.sync="addFormVisible" :close-on-click-modal="false" width="30%">
		    <el-form size="mini" label-width="95px">
		        <el-form-item label="语音文件">
		            <el-upload class="upload-demo" ref="upload" action="/throw_strategy/voice/" :on-success="handleFileSuccess" :on-error="handleFileError" :on-progress="handleFileProgress" :file-list="addFileList" :data="addForm" :multiple="true" :auto-upload="false" accept=".mp3,.wav">
		                <el-button size="small" type="primary">选择语音文件</el-button>
		            </el-upload>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="addVoice">保存</el-button>
		    </div>
		</el-dialog>

		<!--更新策略-->
		<el-dialog title="更新策略" :visible.sync="updateStrategyVisible" :close-on-click-modal="false" width="400px">
			<el-alert type="warning" :closable="false" title="即将更新语音资源策略，请确认操作正确！" show-icon></el-alert>
		    <el-form size="mini" :model="updateStrategyForm" ref="updateStrategyForm" label-width="95px" style="margin-top: 20px;">
		        <el-form-item label="更新方式">
                    <el-select v-model="updateStrategyForm.urgency">
                        <el-option v-for="item in options.urgencyType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button size="small" @click="updateStrategyVisible=false;updateStrategyForm.urgency=0">取消</el-button>
		        <el-button size="small" type="primary" @click="updateStrategy">确定</el-button>
		    </div>
		</el-dialog>

	</section>
</template>

<script>
	import { Loading } from 'element-ui';
	import api from '../../api/api';
	import opts from '../../common/js/options';

	var loading_full;

	export default {
		data() {
			return {
				options: {
	                urgencyType: opts.urgencyType
	            },
				tabs: [
					{name: '官方语言', voice_type: 'official'},
					{name: '女神版', voice_type: 'godess'},
					{name: '蔓蔓版', voice_type: 'manman'},
					{name: 'Lily版', voice_type: 'lily'}
				],
				page: 1,
				page_limit: 1000,
				voice_type: 'official',
				total_num: 0,
				total_size: 0,
				listLoading: false,
				list: [],

				addFormVisible: false,
				addForm: {},
				addFileList: [],

				updateStrategyVisible: false,
				updateStrategyForm: {
					urgency: opts.urgencyType[0].value
				}
			}
		},
		methods: {
			getList() {
				let params = {
					page: this.page,
					page_limit: this.page_limit,
					voice_type: this.voice_type
				};

				this.listLoading = true;
				api.get('/throw_strategy/voice/', params).then((res) => {
					this.listLoading = false;

					if(res.code !== 0) {
						this.$message({message: res.message});
						return;
					}

					res.data = res.data || [];
					for (var i = 0; i < res.data.length; i++) {
						res.data[i].isize = (res.data[i].isize/1024).toFixed(2) + 'KB';
					}
					this.list = res.data;
					this.total_num = res.total;
					this.total_size = res.total_size > (1024*1024) ? (res.total_size/1024/1024).toFixed(2) + 'MB' : (res.total_size/1024).toFixed(2)  + 'KB';
				});
			},
			tabClick(tab, event) {
				this.page = 1;
				this.total_num = 0;
				this.total_size = 0;
				this.list = [];
				this.voice_type = this.tabs[tab.index].voice_type;
				this.getList();
			},
			handleFileError() {
				this.$message({message: '上传失败 [' + err.status + ']', type: 'error'});
				loading_full.close();
			},
			handleFileSuccess(res) {
				loading_full.close();
				if(res.code !== 0) {
					this.$message({message: res.message, type: 'warning'});
					return;
				}

				this.$message({message: '添加语音成功', type: 'success'});
				this.getList();
			},
			handleFileProgress() {
				loading_full = Loading.service({ fullscreen: true, text: '正在上传语音文件...' });
			},
			addVoice() {
				this.addForm.voice_type = this.voice_type;
				this.$refs.upload.submit();
				this.addFormVisible = false;
			},
			delVoice(idx, row) {
				this.$confirm('确定删除该语音资源吗？', '删除提示', {type: 'warning'}).then(() => {
					this.listLoading = true;
					api.del('/throw_strategy/voice/', {id: row.id}).then((res) => {
						this.listLoading = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.getList();
					});
				});
			},
			updateStrategy() {
				this.updateStrategyVisible = false;
				loading_full = Loading.service({ fullscreen: true, text: '更新策略中...' });
				api.put('/throw_strategy/voice/', {urgency: this.updateStrategyForm.urgency}).then((res) => {
					loading_full.close();
					this.updateStrategyForm.urgency = opts.urgencyType[0].value;

					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.getList();
				});
			}
		},
		mounted() {
			this.getList();
		}
	}
</script>

<style scoped>
</style>