<!-- 驱动配置 -->
<template>
    <section>
        <el-col :span="24" style="margin-top: 20px;">
        	<el-card class="box-card">
			  <div slot="header" class="clearfix"><b>Egs驱动配置</b></div>
			  <div>
			  	<el-form size="mini" v-loading="egsFormLoading" :inline="false" label-width="140px">
			        <el-form-item label="版本判断">
				        <el-input v-model="egsForm.low_version" style="width: 180px;"></el-input>
				        <span class="red f12 lh30">需填写文件版本号，小于等于低版本的受低版本开关控制，大于的受高版本控制</span>
				    </el-form-item>
			        
			        <el-form-item label="低版本开关"><el-switch v-model="egsForm.low_auto_mode"></el-switch></el-form-item>
			        <el-form-item label="低版本生效机器尾号">
			        	<el-checkbox-group v-model="egsForm.egsFormLowNum">
			        	<el-checkbox v-for="item in checkboxOpts" :label="item" :key="item" @change="egsForm.egsFormLowNum=handleSetCheckboxArr(item)">{{item}}</el-checkbox>
					    </el-checkbox-group>
			    	</el-form-item>

			        <el-form-item label="高版本开关"><el-switch v-model="egsForm.high_auto_mode"></el-switch></el-form-item>
			        <el-form-item label="高版本生效机器尾号">
			        	<el-checkbox-group v-model="egsForm.egsFormHeightNum">
					      <el-checkbox v-for="item in checkboxOpts" :label="item" :key="item" @change="egsForm.egsFormHeightNum=handleSetCheckboxArr(item)">{{item}}</el-checkbox>
					    </el-checkbox-group>
			    	</el-form-item>

			    	<el-form-item><el-button type="primary" size="small" @click="saveEgs">保存</el-button></el-form-item>
			    </el-form>
			  </div>
			</el-card>
        </el-col>

        <el-col :span="24" style="margin-top: 20px;">
        	<el-card class="box-card">
			  <div slot="header" class="clearfix"><b>Gamezq驱动配置</b></div>
			  <div>
			  	<el-form size="mini" v-loading="gamezqFormLoading" :inline="false" label-width="140px">
			        <el-form-item label="磁盘扫描"><el-switch v-model="gamezqForm.start_disk_scan"></el-switch></el-form-item>
			        <el-form-item label="目录深度">
			        	<el-input-number v-model="gamezqForm.dir_depth" :min="1"></el-input-number>
			    	</el-form-item>

			    	<el-form-item label="版本判断">
				        <el-input v-model="gamezqForm.low_version" style="width: 180px;"></el-input>
				        <span class="red f12 lh30">需填写文件版本号，小于等于低版本的受低版本开关控制，大于的受高版本控制</span>
				    </el-form-item>

				    <el-form-item label="低版本开关"><el-switch v-model="gamezqForm.low_start_process_chain"></el-switch></el-form-item>
			        <el-form-item label="低版本生效机器尾号">
			        	<el-checkbox-group v-model="gamezqForm.egsFormLowNum">
					      <el-checkbox v-for="item in checkboxOpts" :label="item" :key="item" @change="gamezqForm.egsFormLowNum=handleSetCheckboxArr(item)">{{item}}</el-checkbox>
					    </el-checkbox-group>
			    	</el-form-item>

			        <el-form-item label="高版本开关"><el-switch v-model="gamezqForm.high_start_process_chain"></el-switch></el-form-item>
			        <el-form-item label="高版本生效机器尾号">
				        <el-checkbox-group v-model="gamezqForm.egsFormHeightNum">
						    <el-checkbox v-for="item in checkboxOpts" :label="item" :key="item" @change="gamezqForm.egsFormHeightNum=handleSetCheckboxArr(item)">{{item}}</el-checkbox>
						</el-checkbox-group>
			    	</el-form-item>

			    	<el-form-item><el-button type="primary" size="small" @click="saveGamezq">保存</el-button></el-form-item>
			    </el-form>
			  </div>
			</el-card>            
        </el-col>

    </section>
</template>

<script>
	import api from '../../api/api';

	export default {
	    data() {
	        return {
	        	checkboxOpts: [0,1,2,3,4,5,6,7,8,9],

	        	egsFormLoading: true,
	        	egsForm: {egsFormLowNum: [], egsFormHeightNum: []},
	        	egsList: [],
	        	egsListLoading: false,

	        	gamezqFormLoading: true,
	        	gamezqForm: {dir_depth: 1, egsFormLowNum: [], egsFormHeightNum: []},
	        	gamezqList: [],
	        	gamezqListLoading: false
	        }
	    },
	    methods: {
	        getEgs() {
	        	api.get('/egs/inner/gray_auto_mode').then((res) => {
	        		// res = {"data":{"high_auto_mode":1,"low_version":"2018.5.3.1039","low_auto_mode":1,"high_gray_value":3,"low_gray_value":9},"message":"","code":0}; // @remove

					this.egsFormLoading = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

		        	res.data.high_auto_mode = res.data.high_auto_mode ? true : false;
		        	res.data.low_auto_mode = res.data.low_auto_mode ? true : false;
		        	res.data.egsFormLowNum = this.handleSetCheckboxArr(res.data.low_gray_value);
					res.data.egsFormHeightNum = this.handleSetCheckboxArr(res.data.high_gray_value);
		        	this.egsForm = res.data;
				});
	        },
	        saveEgs() {
	        	let params = Object.assign({}, this.egsForm);
	        	if(!params.low_version) {
	        		this.$message({message: '请输入文件版本号', type: 'warning'});
	        		return;
	        	}

	        	params.high_auto_mode = params.high_auto_mode ? 1 : 0;
	        	params.low_auto_mode = params.low_auto_mode ? 1 : 0;
	        	params.high_gray_value = params.egsFormHeightNum[params.egsFormHeightNum.length-1];
	        	params.low_gray_value = params.egsFormHeightNum[params.egsFormLowNum.length-1];
	        	delete params.egsFormHeightNum;
	        	delete params.egsFormLowNum;

	        	api.post('/egs/inner/gray_auto_mode', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$message({message: '保存成功', type: 'success'});
				});
	        },
	        getGamezq() {
	        	api.get('/inner/zq/gamezqpolicy').then((res) => {
	        		// var res = {"data":{"start_disk_scan":1,"low_start_process_chain":0,"low_process_chain_percent":9,"high_start_process_chain":1,"low_version":"2018.4.18.1324","high_process_chain_percent":2,"dir_depth":7},"message":"","code":0}; // @remove

					this.gamezqFormLoading = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					res.data.high_start_process_chain = res.data.high_start_process_chain ? true : false;
					res.data.low_start_process_chain = res.data.low_start_process_chain ? true : false;
					res.data.start_disk_scan = res.data.start_disk_scan ? true : false;
					res.data.egsFormLowNum = this.handleSetCheckboxArr(res.data.low_process_chain_percent);
					res.data.egsFormHeightNum = this.handleSetCheckboxArr(res.data.high_process_chain_percent);
		        	this.gamezqForm = res.data;
				});
	        },
	        saveGamezq() {
	        	let params = Object.assign({}, this.gamezqForm);
	        	if(!params.low_version) {
	        		this.$message({message: '请输入文件版本号', type: 'warning'});
	        		return;
	        	}

	        	params.high_start_process_chain = params.high_start_process_chain ? 1 : 0;
	        	params.low_start_process_chain = params.low_start_process_chain ? 1 : 0;
	        	params.start_disk_scan = params.start_disk_scan ? 1 : 0;
	        	params.low_process_chain_percent = params.egsFormLowNum[params.egsFormLowNum.length-1];
	        	params.high_process_chain_percent = params.egsFormHeightNum[params.egsFormHeightNum.length-1];
	        	delete params.egsFormHeightNum;
	        	delete params.egsFormLowNum;

	        	api.post('/inner/zq/gamezqpolicy', params).then((res) => {
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					this.$message({message: '保存成功', type: 'success'});
				});
	        },
	        handleSetCheckboxArr(num) {
				var arr = [];
				for (var i = 0; i <= num; i++) {
					arr.push(i);
				}

				return arr;
			}
	    },
	    mounted() {
	    	this.getEgs();
	    	this.getGamezq();
	    }
	}
</script>
<style>
.lh30 {
	line-height: 30px;
}
.f12 {
	font-size: 12px;
}
.red {
	color: #F56C6C;
}
</style>
