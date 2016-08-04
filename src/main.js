//libraries
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import {sync} from 'vuex-router-sync'
import store from './vuex/store'
import '../node_modules/semantic-ui-css/semantic.min.css'
// import semantic from 'semantic'
import routes from './router/routes'
import alias from './router/alias'
import * as filters from './filters'
import App from './App'
import {SET_MENU, SET_PROGRESS} from './vuex/types'

//Validator
Vue.use(VueValidator)

//Router
Vue.use(VueRouter)
const router = new VueRouter({
    history: false,
    linkActiveClass: 'active',
    saveScrollPosition: true
})
router.map(routes)
router.alias(alias)
router.beforeEach(transition => {
    // console.log('before router')
    store.dispatch(SET_PROGRESS, {rate: 1})

    if (transition.to.auth && !store.state.auth.token) {
        // transition.abort()
        transition.redirect('/login')
    } else {
        transition.next()
    }
})
router.afterEach(transition => {
    // console.log('after router')
    store.dispatch(SET_PROGRESS, {rate: 2})
    store.dispatch(SET_MENU, {current: transition.to.parent})
    window.scrollTo(0, 0)
})

// Filters
Vue.filter('date', filters.dateFilter)

//router <-> vuex
sync(store, router)

router.start(App, 'app')

