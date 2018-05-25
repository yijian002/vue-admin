<!-- 控制台URL参数 -->
<template>
	<section>
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%; margin-top: 20px;">
			<el-table-column prop="name" label="文件名"></el-table-column>
			<el-table-column prop="sex" label="大小"></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleDel(scope.$index, scope.row)" icon="el-icon-edit" plain></el-button>
				</template>
			</el-table-column>
		</el-table>

	</section>
</template>

<script>
	export default {
		data() {
			return {
				listLoading: false,
				list: [],
			}
		},
		methods: {
			handleDel: function(idx, row) {

			}
		},
		mounted() {
		}
	}
</script>

<style scoped>
</style>