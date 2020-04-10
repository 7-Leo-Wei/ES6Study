<template>
	<div class="indexPage" id="indexPage">
		<div class="headerDiv">
			<p class="showNav" @click="drawer.isShow = true"><i class="fa fa-indent" aria-hidden="true"></i></p>
			<p class="lessonName">{{lessonName}}</p>
			<p></p>
		</div>
		<div class="container" id="container">
			<router-view></router-view>
		</div>
		<el-drawer
		  title="课程列表"
		  size='50%'
		  :visible.sync="drawer.isShow"
		  :direction="drawer.direction">
		  <ul>
		  	<li v-for="(item, index) in lessonList" @click="chgName(item)">
		  		<router-link :to="item.path">{{item.name}}</router-link>
		  	</li>
		  </ul>
		</el-drawer>
	</div>
</template>

<script>
export default ({
	name: 'indexPage',
	data() {
		return {
			drawer: {
				isShow: false,
				direction: 'ltr'
			},
			lessonList: [{
				name: 'ECMAScript 6 简介',
				path: '/LessonOne',
			}, {
				name: 'let 和 const 命令',
				path: '/LessonTwo',
			}, {
				name: '变量的解构赋值',
				path: '/LessonThr',
			}, {
				name: '字符的 Unicode 表示法',
				path: '/LessonFour',
			}],
			lessonName: 'ECMAScript 6 简介',
		}
	},
	methods: {
		chgName(item) {
			this.lessonName = item.name;
			this.drawer.isShow = false;
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		},
		checkStr(str) {
			let strArr = str.split('//');
			let strRes = '';
			strArr.forEach( function(element, index) {
				if (index) {
					let n = element.indexOf('\n');
					let eleStr = element.slice(0, n);
					let newStr = ` <span>// ${eleStr}</span>`;
					element = newStr+element.slice(n);
				}
				strRes += element;
			});
			return strRes;
		},
		checkCode(str) {
			let codeArr = str.split(" ");
			let codeRes = '';
			codeArr.forEach( function(element, index) {
				if (index%2 === 1) {
					element = ` <code>${element}</code>`;
				}
				codeRes += element;
			});
			return codeRes;
		}
	},
	mounted() {
		
	}
});
</script>

<style>
.indexPage{
	width: 100%;
	height: 100%;
}
.indexPage .headerDiv{
	width: 100%;
	height: 2.4rem;
	background: #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #fff;
	font-size: 1rem;
	position: fixed;
	top: 0;
	left: 0;
}
.container{
	padding-top: 2.4rem;
}
.indexPage .headerDiv .showNav{
	margin-left: 0.3rem;
}
.indexPage .words{
	text-align: left;
	padding: 0.6rem;
	box-sizing: border-box;
}
.indexPage .words p{
    text-indent: 2em;
    line-height: 1.3rem;
    margin: 0.6rem auto;
}
.indexPage .words h3{
	line-height: 2rem;
}
.indexPage .words p code{
	padding-left: 3px;
    padding-right: 3px;
    color: #c7254e;
    background: #f9f2f4;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
.indexPage .words hr{
	margin-top: 0.6rem;
	margin-bottom: 1rem;
}
.indexPage .code{
	width: 100%;
	height: auto;
	background: #111;
	color: #a6e22e;
    border-radius: 0.4rem;
    padding: 0.4rem;
    box-sizing: border-box;
    font-size: 0.8rem;
    overflow: hidden;
    overflow-x: auto;
}
.indexPage .code pre{
	font-family: '微软雅黑';
}
.indexPage .code span{
	color: #999;
}
.indexPage .words .codejs{
	width: 100%;
	height: auto;
	background: #111;
	color: #a6e22e;
    border-radius: 0.4rem;
    padding: 0.4rem;
    box-sizing: border-box;
    font-size: 0.8rem;
    overflow: hidden;
    overflow-x: auto;
}
.indexPage .words .codejs pre{
	font-family: '微软雅黑';
}
.indexPage .words .codejs span{
	color: #999;
}
.indexPage .words p span{
	font-weight: bolder;
	color: #3388ff;
}
.indexPage .words .list{
	margin: 0.8rem 0.8rem;
	box-sizing: border-box;
}
.indexPage .words .list ul li{
	text-indent: -8px;
	line-height: 1.3rem;
    font-size: 0.8rem;
}
.indexPage .words .list ul li:before{
	content: '- ';
}
.indexPage .words .list ul li code{
	padding-left: 3px;
    padding-right: 3px;
    color: #c7254e;
    background: #f9f2f4;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>