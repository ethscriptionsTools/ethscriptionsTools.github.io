import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/style/index.less'
// import '@/assets/fonts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/main.scss'
import 'eva-icons/style/eva-icons.css'
import './assets/font/iconfont/iconfont';
import './assets/style/variables.less';

import Components from '@/components/index.js'
import utils from '@/utils/index.js'
import isLogin from '@/utils/isLogin'
import locale from 'element-ui/lib/locale'
import lang from 'element-ui/lib/locale/lang/en'
import nyaCheckbox from './components/UI/nya-checkbox.vue';
import nyaInput from './components/UI/nya-input.vue';
import nyaContainer from './components/UI/nya-container.vue';
import nyaSelect from './components/UI/nya-select';
import nyaLoading from './components/UI/nya-loading.vue';
import nyaRadio from './components/UI/nya-radio/nya-radio.vue';
import nyaRadioGroup from './components/UI/nya-radio/nya-radio-group.vue';
import nyaCopy from './components/UI/nya-copy.vue';
import nyaCircle from './components/UI/nya-circle.vue';

// set language
locale.use(lang)
/* eslint-disable no-new */
Vue.prototype.$isLogin = isLogin
Vue.use(ElementUI)
Vue.use(Components)
Vue.use(utils)
Vue.config.productionTip = false

new Vue({
    router, store, render: (h) => h(App)
}).$mount('#app')


Vue.component('nya-copy', nyaCopy);
Vue.component('nya-checkbox', nyaCheckbox);
Vue.component('nya-input', nyaInput);
Vue.component('nya-container', nyaContainer);
Vue.component('nya-select', nyaSelect);
Vue.component('nya-loading', nyaLoading);
Vue.component('nya-radio', nyaRadio);
Vue.component('nya-radio-group', nyaRadioGroup);
Vue.component('nya-circle', nyaCircle);