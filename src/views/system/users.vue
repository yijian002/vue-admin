<!-- 用户管理 -->
<template>
    <section>
        <el-col :span="24" style="margin-top: 20px;">
            <el-row>
                <el-col :span="16"><h3>用户组</h3></el-col>
                <el-col :span="8" style="text-align: right;">
                    <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAddGroup">增加组</el-button>
                </el-col>
            </el-row>
        </el-col>
        <el-table :data="listGroup" highlight-current-row v-loading="listGroupLoading" style="width: 100%; margin-top: 10px;">
            <el-table-column prop="tgroup_name" label="用户组名称"></el-table-column>
            <el-table-column prop="tmember_count" label="组内成员"></el-table-column>
            <el-table-column prop="tlast_time" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="160">
                <template scope="scope">
                    <el-button type="primary" size="mini" @click="handleEditGroup(scope.$index, scope.row)" icon="el-icon-edit" plain></el-button>
                    <el-button type="danger" size="mini" @click="handleDelGroup(scope.$index, scope.row)" icon="el-icon-delete" plain></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--新增/编辑组-->
		<el-dialog :title="groupFormIsAdd ? '添加用户组' : '编辑用户组'" :visible.sync="groupFormVisible" :close-on-click-modal="false" width="500px">
		    <el-form size="small" :model="groupForm" :rules="groupFormRules" ref="groupForm" label-width="100px" style="width:360px;margin: 0 auto;">
		        <el-form-item label="用户组名称" prop="tgroup_name" required>
		            <el-input v-model="groupForm.tgroup_name" :disabled="groupFormIsAdd ? false : true"></el-input>
		        </el-form-item>
		        <el-form-item label="用户组权限">
		     		<el-tree :data="groupMenuTree" :props="defaultProps" ref="groupMenuTree" node-key="path" show-checkbox default-expand-all check-on-click-node :expand-on-click-node="false" :default-checked-keys="groupForm.tgroup_authority"></el-tree>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="saveGroup">保存</el-button>
		    </div>
		</el-dialog>

        <el-col :span="24" style="margin-top: 20px;">
            <el-row>
                <el-col :span="16"><h3>用户</h3></el-col>
                <el-col :span="8" style="text-align: right;">
                    <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAddUser">增加用户</el-button>
                </el-col>
            </el-row>
        </el-col>
        <el-table :data="listUser" highlight-current-row v-loading="listUserLoading" style="width: 100%; margin-top: 10px;">
            <el-table-column prop="tuser_account" label="帐号"></el-table-column>
            <el-table-column prop="tuser_name" label="姓名"></el-table-column>
            <el-table-column prop="tcreater" label="创建人"></el-table-column>
            <el-table-column prop="tcreater_time" label="创建时间"></el-table-column>
            <el-table-column prop="tlogin_time" label="最后登录时间"></el-table-column>
            <el-table-column label="操作" width="160">
                <template scope="scope">
                    <el-button type="primary" size="mini" @click="handleEditUser(scope.$index, scope.row)" icon="el-icon-edit" plain></el-button>
                    <el-button type="danger" size="mini" @click="handleDelUser(scope.$index, scope.row)" icon="el-icon-delete" plain></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--新增/编辑用户-->
		<el-dialog :title="userFormIsAdd ? '添加用户' : '编辑用户'" :visible.sync="userFormVisible" :close-on-click-modal="false" width="400px">
		    <el-form size="small" :model="userForm" :rules="userFormRules" ref="userForm" label-width="70px" style="width:290px;margin: 0 auto;">
		        <el-form-item label="用户名" prop="tuser_account" required>
		            <el-input v-model="userForm.tuser_account" :disabled="userFormIsAdd?false:true"></el-input>
		        </el-form-item>
		        <el-form-item label="密码" prop="tuser_pwd" required>
		            <el-input v-model="userForm.tuser_pwd" :maxlength="20"></el-input>
		        </el-form-item>
		        <el-form-item label="姓名" prop="tuser_name" required>
		            <el-input v-model="userForm.tuser_name"></el-input>
		        </el-form-item>
		        <el-form-item label="用户组" prop="tgroup_id" required>
		            <el-select v-model="userForm.tgroup_id">
		                <el-option v-for="item in listGroup" :key="item.tgroup_id" :label="item.tgroup_name" :value="item.tgroup_id"></el-option>
		            </el-select>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="saveUser">保存</el-button>
		    </div>
		</el-dialog>

    </section>
</template>

<script>
	import { Loading } from 'element-ui';
	import comm from '../../common/js/comm'
	import api from '../../api/api';
	import routes from '../../routes';

	let userinfo = JSON.parse(sessionStorage.getItem('user'));

	export default {
	    data() {
	        return {
	            listGroupLoading: false,
	            listGroup: [],
	            groupFormVisible: false,
	            groupFormIsAdd: true,
	            groupForm: {
	            	tgroup_name: '',
	            	tgroup_authority: []
	            },
	            groupFormRules: {
	            	tgroup_name: [{required: true, message: '请输入用户组名称', trigger: 'blur'}],
	            },
	            groupMenuTree: [],
	            defaultProps: { // 树形结构配置
	            	children: 'children',
	            	label: 'name'
	            },

	            listUserLoading: false,
	            listUser: [],
	            userFormVisible: false,
	            userFormIsAdd: true, // 是否为新增，否则为修改
	            userForm: {
	            	tuser_account: '',
	        		tuser_pwd: '',
	        		tuser_name: '',
	        		tgroup_id: ''
	        	},
	            userFormRules: {
	            	tuser_account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
	            	tuser_pwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
	            	tuser_name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
	            	tgroup_id: [{required: true, message: '请选择用户组', trigger: 'change'}]
	            }
	        }
	    },
	    methods: {
	        getUserGroup() {
	        	let params ={tgroup_name: '', page: 1, page_limit: 100};

	            this.listGroupLoading = true;
	            api.get('/sysmanage/user_group/', params).then((res) => {
	                this.listGroupLoading = false;

	                res.data = res.data || [];
	                for (var i = 0; i < res.data.length; i++) {
	                	let item = res.data[i];
	                	item.tlast_time = item.tlast_time ? comm.getDate(item.tlast_time) : '';
	                }
	                this.listGroup = res.data;
	            });
	        },
	        getUser() {
	        	let params = {page: 1, page_limit: 100};

	            this.listUserLoading = true;
	            api.get('/sysmanage/user/', params).then((res) => {
	                this.listUserLoading = false;

	                res.data = res.data || [];
	                for (var i = 0; i < res.data.length; i++) {
	                	let item = res.data[i];
	                	item.tcreater_time = comm.getDate(item.tcreater_time);
	                	item.tlogin_time = item.tlogin_time ? comm.getDate(item.tlogin_time) : '';
	                }
	                this.listUser = res.data;
	            });
	        },
	        saveGroup() { // 新增/修改用户组
	        	this.$refs.groupForm.validate((valid) => {
					if(!valid) {
						return;
					}

					let params = Object.assign({}, this.groupForm),
						tgroup_authority = this.$refs.groupMenuTree.getCheckedKeys().filter(item => item), // 选中的权限树keys
						apiSave = this.groupFormIsAdd ? api.post : api.put;
					
					params.tgroup_authority = JSON.stringify(tgroup_authority);
					apiSave('/sysmanage/user_group/', params).then((res) => {
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.groupFormVisible = false;
						this.$message({message: '保存成功', type: 'success'});
						this.getUserGroup();
					});
				});
	        },
	        handleAddGroup() {
	        	this.groupFormVisible = true;
	        	this.groupFormIsAdd = true;

	        	if(this.$refs.groupForm !== undefined) {
	        		this.$refs.groupForm.resetFields();
	        	}

	        	this.groupForm = {tgroup_name: '', tgroup_authority: []};
	        	if(this.$refs.groupMenuTree !== undefined) {
	        		this.$refs.groupMenuTree.setCheckedKeys([], true);	
	        	}
	        },
	        handleEditGroup(idx, row) {
	        	this.groupFormVisible = true;
	        	this.groupFormIsAdd = false;

	        	this.groupForm = {
	            	tgroup_name: row.tgroup_name,
	            	tgroup_authority: row.tgroup_authority ? JSON.parse(row.tgroup_authority) : []
	        	};
	        	if(this.$refs.groupMenuTree !== undefined) {
	        		this.$refs.groupMenuTree.setCheckedKeys(this.groupForm.tgroup_authority, true);
	        	}
	        },
	        handleDelGroup(idx, row) {
	        	this.$confirm('确认删除该用户组吗？', '删除提示', {type: 'warning'}).then(() => {
					this.listGroupLoading = true;
					api.del('/sysmanage/user_group/', {tgroup_name: row.tgroup_name}).then((res) => {
						this.listGroupLoading = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '删除成功', type: 'success'});
						this.getUserGroup();
					});
				});
	        },
	        saveUser() { // 新增/修改用户
	        	this.$refs.userForm.validate((valid) => {
					if(!valid) {
						return;
					}

					let params = Object.assign({}, this.userForm),
						apiSave = this.userFormIsAdd ? api.post : api.put;

					apiSave('/sysmanage/user/', params).then((res) => {
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.userFormVisible = false;
						this.$message({message: '保存成功', type: 'success'});
						this.getUser();
						this.getUserGroup();
					});
				});
	        },
	        handleAddUser() {
	        	this.userFormVisible = true;
	        	this.userFormIsAdd = true;

	        	if(this.$refs.userForm !== undefined) {
	        		this.$refs.userForm.resetFields();
	        	}
	        	this.userForm = {
	            	tuser_account: '',
	        		tuser_pwd: '',
	        		tuser_name: '',
	        		tgroup_id: ''
	        	};
	        },
	        handleEditUser(idx, row) {
	        	this.userFormVisible = true;
	        	this.userFormIsAdd = false;
	        	this.userForm = {
	            	tuser_account: row.tuser_account,
	        		tuser_pwd: row.tuser_pwd,
	        		tuser_name: row.tuser_name,
	        		tgroup_id: row.tgroup_id
	        	};
	        },
	        handleDelUser(idx, row) {
	        	this.$confirm('确认删除该用户吗？', '删除提示', {type: 'warning'}).then(() => {
					this.listUserLoading = true;
					api.del('/sysmanage/user/', {tuser_account: row.tuser_account}).then((res) => {
						this.listUserLoading = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '删除成功', type: 'success'});
						this.getUser();
						this.getUserGroup();
					});
				});
	        }
	    },
	    mounted() {
	        this.getUserGroup();
	        this.getUser();

	        // 菜单权限设置列表
	        for (var i = 0; i < routes.length; i++) {
	        	if(routes[i].isMenu) {
		        	this.groupMenuTree.push(routes[i]);
		        }
	        }
	    }
	}
</script>
<style scoped>
</style>
