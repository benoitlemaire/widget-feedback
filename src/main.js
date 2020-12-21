import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import './assets/styles/index.css';
import Home from './views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    props: true,
  },
];

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
