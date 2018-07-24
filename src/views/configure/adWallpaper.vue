<!-- 广告壁纸 -->
<template>
	<section>
		<el-tabs type="card" style="height: 200px; margin-top: 20px;">
        	<el-tab-pane label="投放配置">
            	<el-form size="mini" label-width="100px" class="el-form-medium" style="width: 600px; margin-top: 10px;">
            		<el-form-item label="壁纸类型" required>
            			<el-tooltip popper-class="el-tooltip-red" effect="light" content="显示在网吧壁纸后面" placement="left">
            				<el-radio v-model="formWallpaper.wtype" 
            					:label="optionsWallpaperType[0].value" 
            					@change="fileListLimit = optionsWallpaperType[0].limit; fileList = []; formWallpaper.image_id = [];"
            					>{{optionsWallpaperType[0].label}}</el-radio>
            			</el-tooltip>
            			<el-tooltip popper-class="el-tooltip-red" effect="light" content="显示在网吧壁纸前面" placement="right">
  							<el-radio v-model="formWallpaper.wtype" 
  								:label="optionsWallpaperType[1].value" 
  								@change="fileListLimit = optionsWallpaperType[1].limit; fileList = []; formWallpaper.image_id = [];"
  								>{{optionsWallpaperType[1].label}}</el-radio>
  						</el-tooltip>
		            </el-form-item>

		            <el-form-item label="上传壁纸" required>
            			<el-upload
							class="upload-demo"
							action="/wallpaper/upload/"
							:limit="fileListLimit"
							:on-success="handleFileSuccess"
							:on-error="handleFileError"
							:on-exceed="handleFileExceed"
							:on-remove="handleFileRemove"
							:file-list="fileList"
							:multiple="true"
							accept=".jpg"
							name="file"
							list-type="picture">
						  <el-button size="mini" type="primary" icon="el-icon-upload2">上传</el-button>
						  <b slot="tip" class="el-upload__tip" style="margin-left: 20px;">最多上传 {{fileListLimit}} 张，上传2M以内，jpg格式</b>
						</el-upload>
		            </el-form-item>

		            <el-form-item label="生效时间" required>
		                <el-date-picker v-model="formWallpaperDatetime" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right">
		                </el-date-picker>
		            </el-form-item>

		            <el-form-item label="投放类型" required>
		                <el-select v-model="formWallpaper.ttype" @change="handleChangeShowthrowTip">
		                    <el-option v-for="item in optionsThorwType" :key="item.value" :label="item.label" :value="item.value"></el-option>
		                </el-select>
		            </el-form-item>

		            <el-form-item v-show="formLaunchShowSnbids">
		            	<el-input type="textarea" v-model="formWallpaper.snbids" placeholder="输入网吧账号，逗号或回车隔开。"></el-input>
		            </el-form-item>
		            <el-form-item><el-button size="medium" type="primary" style="margin-top: 10px;" @click="handleAddLaunch">确认投放</el-button></el-form-item>
		        </el-form>
        	</el-tab-pane>

            <el-tab-pane label="查询或撤消">
            	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form size="mini" :inline="true">
                        <el-form-item label="壁纸类型">
                            <el-select v-model="formRevoke.wtype">
                                <el-option :key="optionsThorwDef.value" :label="optionsThorwDef.label" :value="optionsThorwDef.value"></el-option>
                                <el-option v-for="item in optionsWallpaperType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="输入账号">
                            <el-input v-model="formRevoke.snbid" :maxlength="40" placeholder="不输入账号则为全国查询"></el-input>
                        </el-form-item>
                        <el-form-item><el-button type="primary" icon="el-icon-search" @click="getListRevoke">查询</el-button></el-form-item>
                        <el-form-item><el-button type="info" icon="el-icon-document" @click="exportRevoke">导出查询结果</el-button></el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="listRevoke" highlight-current-row v-loading="listLoadingRevoke" @selection-change="selsRevokesChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="snbid" label="网吧账号"></el-table-column>
                    <el-table-column prop="wtype" label="壁纸类型"></el-table-column>
                    <el-table-column label="生效时间" width="320">
                    	<template scope="scope"><el-col>{{scope.row.start_time}} <span class="blue">至</span> {{scope.row.end_time}}</el-col></template>
                	</el-table-column>
                    <el-table-column prop="istat" label="生效状态"></el-table-column>
                    <el-table-column prop="lasttime" label="投放时间"></el-table-column>
                    <el-table-column prop="inman" label="投放人"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                            <el-button type="primary" size="mini" @click="handleListShowPhoto(scope.row)" plain>查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-col :span="24" class="toolbar">
                    <el-button type="danger" size="mini" @click="removeRevokes" :disabled="this.selsRevoke.length===0">撤消选中</el-button>
                    <el-button type="warning" size="mini" @click="removeAllRevokes" icon="el-icon-warning">撤消所有查询结果</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeRevoke" :current-page="formRevoke.page" :page-size="formRevoke.page_limit" :total="formRevokeTotal" style="float:right;"></el-pagination>
                </el-col>

                <gallery :images="wallpaperImages" :index="wallpaperImagesIndex" @close="wallpaperImagesIndex=null"></gallery>
        	</el-tab-pane>
        </el-tabs>


        <el-dialog title="投放结果" :visible.sync="addLaunchResultVisible" :close-on-click-modal="false" width="800px">
		    <el-row>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">成功：{{addLaunchResultSuccess.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="addLaunchResultSuccess.join('\n')"></el-input>
				</el-col>
				<el-col :span="12">
					<div style="margin: 0 0 10px 20px;">失败：{{addLaunchResultFail.length}}</div>
					<el-input type="textarea" :rows="20" :readonly="true" v-model="addLaunchResultFail.join('\n')"></el-input>
				</el-col>
			</el-row>
		</el-dialog>
		
	</section>
</template>

<script>
	import VueGallery from 'vue-gallery';
	import { Loading } from 'element-ui';
	import api from '../../api/api';
	import comm from '../../common/js/comm';

	export default {
		data() {
			return {
				optionsWallpaperType: [
					{label: '游戏壁纸', value: 0, limit: 1},
					{label: '广告壁纸', value: 1, limit: 3}
				],
				formWallpaper: {
					ttype: 1,
					snbids: '',
					wtype: 0,
					image_id: []
				},
				formWallpaperDatetime: '',
				fileList: [],
				fileListLimit: 1,
				optionsThorwDef: {label: '不限', value: ''},
				optionsThorwType: [
					{label: '账号', value: 1, show_snbids: true},
					{label: '全国', value: 3, show_snbids: false, smark: '（只针对全国当前所有的账号投放，新增账号除外）'}
				],
				optionsThorwTypeTip: '',
				formLaunchShowSnbids: true,

				addLaunchResultVisible: false,
				addLaunchResultSuccess: [],
				addLaunchResultFail: [],
				formRevoke: {
	                snbid: '',
	                wtype: '',
	                page: 1,
	                page_limit: 20
	            },
	            formRevokeTotal: 0,
				listLoadingRevoke: false,
				listRevoke: [],
				selsRevoke: [],

				wallpaperImages: [],
				wallpaperImagesIndex: null
			}
		},
		components: {
			gallery: VueGallery
		},
		methods: {
			initDatetime() {
                var datetime = new Date().getTime(),
                    tomorrow = comm.getDate(datetime + (24*60*60*1000), 'YMD');

                this.formWallpaperDatetime = [datetime, new Date(tomorrow + ' 00:00:00').getTime()];
            },
            resetWallpaperImageList(fileList) {
            	this.formWallpaper.image_id = [];
				for (let i = 0; i < fileList.length; i++) {
					this.formWallpaper.image_id.push(fileList[i].response.data.image_id[0]);
				}
            },
			handleFileError(err) {
				this.$message({message: '上传失败 [' + err.status + ']', type: 'error'});
				this.fileList = [];
				this.formWallpaper.image_id = [];
			},
			handleFileExceed() {
				this.$message({message: '上传失败，最多可上传' + this.fileListLimit + '张壁纸', type: 'warning'});
			},
			handleFileRemove(file, fileList) {
				this.resetWallpaperImageList(fileList);
			},
			handleFileSuccess(res, file, fileList) {
				this.resetWallpaperImageList(fileList);

				if(res.code !== 0) {
					this.$message({message: res.message, type: 'error'});
					return;
				}
			},
			handleChangeShowthrowTip() {
				let ttype = this.formWallpaper.ttype;

				for (var i = 0; i < this.optionsThorwType.length; i++) {
					if(this.optionsThorwType[i].value === ttype) {
						this.optionsThorwTypeTip = this.optionsThorwType[i].smark || '';
						this.formLaunchShowSnbids = this.optionsThorwType[i].show_snbids;
						break;
					}
				}

				this.formWallpaper.snbids = '';
			},
			handleAddLaunch() {
				let params = Object.assign({}, this.formWallpaper);

				if(!params.image_id || !params.image_id.length) {
					this.$message({message: '请先上传壁纸', type: 'warning'});
					return;
				}

				if(params.ttype === 1 && !params.snbids) {
					this.$message({message: '请输入网吧账号', type: 'warning'});
					return;
				}

				if(params.snbids) {
					params.snbids = comm.setIds(params.snbids);	
				}

				if(!this.formWallpaperDatetime) {
					this.$message({message: '请选择生效时间', type: 'warning'});
					return;
				}

				params.start_time = parseInt(this.formWallpaperDatetime[0]/1000);
				params.end_time = parseInt(this.formWallpaperDatetime[1]/1000);

				this.$confirm('确认要进行投放吗？', '投放提示', {type: 'warning'}).then(() => {
					let loading = Loading.service({ fullscreen: true, text: '正在提交投放信息...' });
					api.post('/wallpaper/strategy/', params).then((res) => {
						loading.close();
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '投放提交成功', type: 'success'});
						this.formWallpaper.snbids = '';

						if(params.ttype === 1) {
							this.addLaunchResultVisible = true;
							this.addLaunchResultSuccess = res.data.success || [];
							this.addLaunchResultFail = res.data.failed || [];
						}

						this.getListRevoke();
					});
				});
			},
			findWallpaperItem(val) {
				let label = '';
				for (let i = 0; i < this.optionsWallpaperType.length; i++) {
					if(this.optionsWallpaperType[i].value === val) {
						label = this.optionsWallpaperType[i].label;
					}
				}

				return label;
			},
			getListRevoke() {
				let params = Object.assign({}, this.formRevoke);

				this.listLoadingRevoke = true;
				api.get('/wallpaper/strategy/', params).then((res) => {
					this.listLoadingRevoke = false;
					if(res.code !== 0) {
						this.$message({message: res.message, type: 'warning'});
						return;
					}

					let list = res.data || [],
						o_status = {1: '未生效', 2: '生效中', 3: '已过期', 4: '已撤销'},
						item;
					for (let i = 0; i < list.length; i++) {
						item = list[i];
						item.lasttime = comm.getDate(item.lasttime);
						item.wtype = this.findWallpaperItem(item.wtype);
						item.start_time = comm.getDate(item.start_time);
                    	item.end_time = comm.getDate(item.end_time);
                    	item.istat = o_status[item.istat] || item.istat;
					}

					this.listRevoke = list;
					this.formRevokeTotal = res.total;
				});
			},
			removeRevokes() {
				let ids = this.selsRevoke.map(item => item.id);

	        	this.$confirm('确认撤消选中的投放？', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.put('/wallpaper/strategy/', {ids: ids}).then((res) => {
						this.listLoadingRevoke = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '撤消成功', type: 'success'});
						this.getListRevoke();
					});
				});
			},
			removeAllRevokes() {
				let params = {
	        		wtype: this.formRevoke.wtype,
	        		snbid: this.formRevoke.snbid
	        	};

	        	if(parseFloat(params.wtype).toString() === 'NaN') {
	        		this.$message({message: '请选择壁纸类型才可以进行撤消操作！', type: 'warning'});
	        		return;
	        	}

	        	this.$confirm('该操作会撤消目前查询条件下所有结果数据，请确认查询结果符合你的要求！', '撤消提示', {type: 'warning'}).then(() => {
					this.listLoadingRevoke = true;
					api.del('/wallpaper/strategy/', params).then((res) => {
						this.listLoadingRevoke = false;
						if(res.code !== 0) {
							this.$message({message: res.message, type: 'warning'});
							return;
						}

						this.$message({message: '撤消查询结果操作成功', type: 'success'});
						this.getListRevoke();
					});
				});
			},
			exportRevoke() {
				let params = {
	        		wtype: this.formRevoke.wtype,
	        		snbid: this.formRevoke.snbid
	        	};

	        	api.gourl('/wallpaper/strategy/export/', params);
			},
			handleCurrentChangeRevoke(val) {
	        	this.formRevoke.page = val;
				this.getListRevoke();
	        },
			selsRevokesChange(sels) {
	            this.selsRevoke = sels;
	        },
	        handleListShowPhoto(row) {
	        	this.wallpaperImages = row.image_urls;
	        	this.wallpaperImagesIndex = 0;
	        }
		},
		mounted() {
			this.initDatetime();
			this.getListRevoke();
		}
	}
</script>
