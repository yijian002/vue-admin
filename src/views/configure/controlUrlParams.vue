<!-- 控制台URL参数 -->
<template>
	<section>
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%; margin-top: 20px;">
			<el-table-column prop="name" label="参数类型"></el-table-column>
			<el-table-column prop="url" label="URL地址"></el-table-column>
			<el-table-column label="操作" width="120">
				<template scope="scope">
					<el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" plain></el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--修改更新包-->
		<el-dialog title="修改URL地址" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
		    <el-form size="mini" :model="editForm" ref="editForm" label-width="180px">
		        <el-form-item :label="editForm.name"><el-input v-model="editForm.url"></el-input></el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="editList(editForm.idx)">保存</el-button>
		    </div>
		</el-dialog>
	</section>
</template>

<script>
	import api from '../../api/api';

	export default {
		data() {
			return {
				editFormVisible: false,
				editForm: {idx: '', name: '', url: ''},
				listLoading: false,
				list: []
			}
		},
		methods: {
			getList() {
				this.listLoading = true;
				api.get('/console_configuration/url/').then((res) => {
					this.listLoading = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'error'});
						return;
					}

					this.list = [
						{name: '万象OL管理后台地址', url: res.data.wx_ol_manage_url, key: 'wx_ol_manage_url'},
						{name: 'PubwinOL管理后台地址', url: res.data.pb_ol_manage_url, key: 'pb_ol_manage_url'},
						{name: '全网版管理后台地址', url: res.data.total_manage_url, key: 'total_manage_url'},
						{name: '帮助中心地址', url: res.data.helper_center_url, key: 'helper_center_url'}
					];
				});
			},
			editList(idx) {
				if(!this.editForm.url) {
					this.$message({message: '请输入URL地址', type: 'warning'});
					return;
				}

				this.list[idx].url = this.editForm.url;

				let params = {};
				for (var i = 0; i < this.list.length; i++) {
					let item = this.list[i];
					params[item.key] = item.url;
				}

				this.editFormVisible = false;
				api.put('/console_configuration/url/', params).then((res) => {
					this.getList();
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$message({message: '保存成功', type: 'success'});
				});
			},
			handleEdit(idx, row) {
				this.editFormVisible = true;
				this.editForm = {idx: idx, name: row.name, url: row.url};
			}
		},
		mounted() {
			this.getList();
		}
	}
</script>