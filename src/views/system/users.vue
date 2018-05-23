<template>
	<section>
		<el-col :span="24" style="margin-top: 20px;">
			<el-row>
				<el-col :span="16"><h3>用户组</h3></el-col>
				<el-col :span="8" style="text-align: right;"><el-button type="primary" size="small" @click="handleAddGroup">增加组</el-button></el-col>
			</el-row>
		</el-col>
		<el-table :data="listGroup" highlight-current-row v-loading="listGroupLoading" style="width: 100%; margin-top: 10px;">
			<el-table-column prop="tgroup_name" label="用户组名称"></el-table-column>
			<el-table-column prop="tmember_count" label="组内成员"></el-table-column>
			<el-table-column prop="tlast_time" label="更新时间"></el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button type="primary" size="mini" @click="handleEditGroup(scope.$index, scope.row)" plain>编辑</el-button>
					<el-button type="danger" size="mini" @click="handleDelGroup(scope.$index, scope.row)" plain>删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" style="margin-top: 20px;">
			<el-row>
				<el-col :span="16"><h3>用户</h3></el-col>
				<el-col :span="8" style="text-align: right;"><el-button type="primary" size="small" @click="handleAddUser">增加用户</el-button></el-col>
			</el-row>
		</el-col>
		<el-table :data="listUser" highlight-current-row v-loading="listUserLoading" style="width: 100%; margin-top: 10px;">
			<el-table-column prop="tuser_account" label="帐号"></el-table-column>
			<el-table-column prop="tuser_name" label="姓名"></el-table-column>
			<el-table-column prop="tcreater" label="创建人"></el-table-column>
			<el-table-column prop="tcreater_time" label="创建时间"></el-table-column>
			<el-table-column prop="tlogin_time" label="最后登录时间"></el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button type="primary" size="mini" @click="handleEditUser(scope.$index, scope.row)" plain>编辑</el-button>
					<el-button type="danger" size="mini" @click="handleDelUser(scope.$index, scope.row)" plain>删除</el-button>
				</template>
			</el-table-column>
		</el-table>

	</section>
</template>

<script>
	import api from '../../api/api';

	export default {
		data() {
			return {
				listGroupLoading: false,
				listGroup: [],
				listUserLoading: false,
				listUser: []
			}
		},
		methods: {
			getUserGroup: function() {
				this.listGroupLoading = true;

				api.get('/sysmanage/user_group/', {
					tuser_name: '',
					page: 1,
					page_limit: 100
				}).then((res) => {
					this.listGroupLoading = false;
					this.listGroup = res.data;
				});
			},
			getUser: function() {
				this.listUserLoading = true;

				api.get('/sysmanage/user/', {
					tuser_name: '',
					tgroup_id: -1,
					start_time: 0,
					end_time: 0,
					page: 1,
					page_limit: 100
				}).then((res) => {
					this.listUserLoading = false;
					this.listUser = res.data;
				});
			},
			handleAddGroup: function() {

			},
			handleAddUser: function() {

			},
			handleEditGroup: function(idx, row) {

			},
			handleDelGroup: function(idx, row) {

			},
			handleEditUser: function(idx, row) {

			},
			handleDelUser: function(idx, row) {

			}
		},
		mounted() {
			this.getUserGroup();
			this.getUser();
		}
	}
</script>

<style type="text/css">
</style>