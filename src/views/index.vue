<template></template>
<script>
	export default {
		data() {
			return {}
		},
		methods: {
			init() {
				let userinfo = JSON.parse(sessionStorage.getItem('user')),
					group_authority = userinfo.group_authority ? JSON.parse(userinfo.group_authority) : null;

				if(group_authority && group_authority.length) {
					this.$router.push({ path: group_authority[0] });
				}
				else {
					this.$alert('登录账号没有授权可管理的栏目', {
						type: 'warning',
						callback: ()=> {
							this.$router.push({ path: '/login' });
						}
					});
				}
			}
		},
		mounted() {
			this.init();
		}
	}
</script>