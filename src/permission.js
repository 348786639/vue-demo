//使用钩子函数对路由进行权限跳转
import router from './router'

//使用nprogress  要先安装$ npm install --save nprogress 
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
router.beforeEach((to, from, next) => {

    NProgress.start()


    if (to.meta.title) {
        document.title = to.meta.title
      }

    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done()
  })