<!-- 版本限制 -->
<template>
	<section>
		<el-tabs type="card" style="height: 200px; margin-top: 20px;">
            <el-tab-pane label="投 放">
            	<el-form size="mini" label-width="150px" style="width: 400px; margin-top: 10px;">
	                <el-form-item label="限制控制台最低版本">
			            <el-input v-model.trim="formLaunch.version" :maxlength="20" placeholder="空版本为不限制"></el-input>
			        </el-form-item>
			        <el-input type="textarea" v-model="formLaunch.snbids" placeholder="输入网吧账号，逗号隔开。"></el-input>
			        <el-button size="medium" type="primary" style="margin: 20px 0 0 20px;" @click="addLaunch">确认投放</el-button>
			    </el-form>
        	</el-tab-pane>

            <el-tab-pane label="查询或撤销">
            	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form size="mini" :inline="true">
                        <el-form-item label="账号">
                            <el-input v-model="formList.snbid" :maxlength="40"></el-input>
                        </el-form-item>
                        <el-form-item><el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button></el-form-item>
                        <el-form-item><el-button type="info" icon="el-icon-document" @click="exportList">导出查询结果</el-button></el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="账号"></el-table-column>
                    <el-table-column prop="content" label="限制版本号"></el-table-column>
                    <el-table-column prop="inman" label="投放人"></el-table-column>
                    <el-table-column prop="iinserttime" label="投放时间"></el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar">
                    <el-button type="danger" size="mini" @click="removeList" :disabled="this.selsList.length===0">撤销选中</el-button>
                </el-col>
        	</el-tab-pane>
        </el-tabs>
	</section>
</template>

<script>
	import api from '../../api/api';
	import comm from '../../common/js/comm';

	export default {
		data() {
			return {
				formLaunch: {
					version: '',
					snbids: ''
				},
				formList: {
					snbid: '',
					page: 1,
					page_limit: 1000
				},
				listLoading: false,
				list: [],
				selsList: []
			}
		},
		methods: {
			addLaunch() {
				if(this.formLaunch.version !== '') {
					var re = /^(\d|\d\d|\d\d\d).(\d|\d\d|\d\d\d).(\d|\d\d|\d\d\d).(\d|\d\d|\d\d\d)$/g;
					if(!re.test(this.formLaunch.version)) {
						this.$message({message: '版本号格式为：X.X.X.X，X范围在0-999', type: 'warning'});
						return;
					}
				}

				let params = {version: this.formLaunch.version, snbids: comm.setIds(this.formLaunch.snbids)};
				if(!params.snbids) {
					this.$message({message: '请输入网吧账号', type: 'warning'});
					return;
				}

				api.post('/console_configuration/version/', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$message({message: '投放操作成功', type: 'success'});
					this.formLaunch = {version: '', snbids: ''};
				});
			},
			getList() {
				let params = Object.assign({}, this.formList);

				this.listLoading = true;
				api.get('/console_configuration/version/', params).then((res) => {
					this.listLoading = false;

					res.data = res.data || [];
					for (var i = 0; i < res.data.length; i++) {
						let item = res.data[i];
						item.iinserttime = comm.getDate(item.iinserttime);
					}

					this.list = res.data;
				});
			},
			removeList() {
				let ids = this.selsList.map(item => item.id);

	        	this.$confirm('正在撤销'+ ids.length +'个账号的投放，点击确定继续撤销', '撤销提示', {type: 'warning'}).then(() => {
					this.listLoading = true;
					api.del('/console_configuration/version/', {id: ids}).then((res) => {
						this.listLoading = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '撤销成功', type: 'success'});
						this.getList();
					});
				});
			},
			exportList() {
				api.gourl('/console_configuration/export', {itype: 1, snbid: this.formList.snbid});
			},
			selsChange(sels) {
				this.selsList = sels;
			}
		},
		mounted() {
			this.getList();
		}
	}
</script>