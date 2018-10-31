// import 'es6-promise/auto';
import 'firebase';
import Vue from 'vue/dist/vue.js';
import VueFire from 'vuefire';
import App from './App.vue';


Vue.use(VueFire);

// Plugin for webstorage (https://github.com/ankurk91/vue-web-storage)
import Storage from 'vue-web-storage';
Vue.use(Storage, {
  prefix: '3600steps',
});

// Buefy is a css framework and components library for Vue based on Bulma. (https://bulma.io & https://buefy.github.io)
import Buefy from 'buefy';
Vue.use(Buefy);

// Masonry (https://github.com/shershen08/vue-masonry)
import { VueMasonryPlugin } from 'vue-masonry';
Vue.use(VueMasonryPlugin);


// Form validation (https://www.npmjs.com/package/vue-form)
import VueForm from 'vue-form';
Vue.use(VueForm);

// Vue Router
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Meta from 'vue-meta'
Vue.use(Meta)


Vue.use(Meta, {
  keyName: 'metaInfo', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-vue-meta', // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: 'data-vue-meta-server-rendered', // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: 'vmid' // the property name that vue-meta uses to determine whether to overwrite or append a tag
})


Vue.config.productionTip = false;

import Home from './views/Home.vue';
import Help from './views/Help.vue';
import Walk from './views/Walk.vue';


var Routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/help',
    component: Help,
  },
  {
    path: '/:id',
    component: Walk,
  },
];

var router = new VueRouter({
  routes: Routes,
  mode: 'history',
});

new Vue({
  render: h => h(App),
  router: router,
}).$mount('#app');
