import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
// import IndexPage from '@/components/IndexPage'
const IndexPage = () => import('../components/IndexPage')    //路由懒加载
const LessonOne = () => import('../components/LessonOne')
const LessonTwo = () => import('../components/LessonTwo')
const LessonThr = () => import('../components/LessonThr')
const LessonFour = () => import('../components/LessonFour')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    }, {
      path: '/IndexPage',
      name: 'IndexPage',
      component: IndexPage,
      redirect: { name: 'LessonOne' },
      children: [{
      	path: '/LessonOne',
        name: 'LessonOne',
        component: LessonOne
      }, {
      	path: '/LessonTwo',
        name: 'LessonTwo',
        component: LessonTwo
      }, {
      	path: '/LessonThr',
        name: 'LessonThr',
        component: LessonThr
      }, {
      	path: '/LessonFour',
        name: 'LessonFour',
        component: LessonFour
      }]
    }
  ]
})
