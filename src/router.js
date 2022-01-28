import Vue from 'vue'
import Router from 'vue-router'
import { isLogged } from './utility/auth'

import Login from './components/Forms/Login'
import ModifyData from './components/Forms/ModifyData'
import CreateEmployee from './components/Forms/CreateEmployee'
import AddPayment from './components/Forms/AddPayment'

import Home from './components/AllPages/Home'
import CustomersPage from './components/AllPages/CustomersPage'
import EmployeesPage from './components/AllPages/EmployeesPage'
import ProductsPage from './components/AllPages/ProductsPage'
import RentalsPage from './components/AllPages/RentalsPage'
import RentalsStats from './components/AllPages/RentalsStats'

import SingleCustomer from './components/SinglePages/SingleCustomer'
import SingleEmployee from './components/SinglePages/SingleEmployee'
import SingleProduct from './components/SinglePages/SingleProduct'
import SingleRental from './components/SinglePages/SingleRental'


Vue.use(Router)

const employeePath = 'https://site202129.tw.cs.unibo.it/staff'
const customerPath = 'https://site202129.tw.cs.unibo.it/home/login'

const routes = [
    { path: '/', meta: {requiresAuth: true, notAuth: 'Login'}, component: Home },
    { path: '/login', name: 'Login', component: Login },
    { 
        path: '/loginEmployee', 
        name: 'LoginEmployee',
        beforeEnter () {
            window.location = employeePath
        }
    },
    { 
        path: '/loginCustomer', 
        name: 'LoginCustomer',
        beforeEnter () {
            window.location = customerPath
        }
    },
    { path: '/customers', meta: {requiresAuth: true, notAuth: 'Login'}, component: CustomersPage, name: 'CustomersPage' },
    { path: '/customers/:id', meta: {requiresAuth: true, notAuth: 'Login'}, component: SingleCustomer, name: 'SingleCustomer' },
    { path: '/employees', meta: {requiresAuth: true, notAuth: 'Login'}, component: EmployeesPage, name: 'EmployeesPage' },
    { path: '/employees/:id', meta: {requiresAuth: true, notAuth: 'Login'}, component: SingleEmployee, name: 'SingleEmployee' },
    { path: '/modify', meta: {requiresAuth: true, notAuth: 'Login'}, component: ModifyData, name: 'ModifyData' },
    { path: '/products', meta: {requiresAuth: true, notAuth: 'Login'}, component: ProductsPage, name: 'ProductsPage' },
    { path: '/products/:id', meta: {requiresAuth: true, notAuth: 'Login'}, component: SingleProduct, name: 'SingleProduct' },
    { path: '/rentals', meta: {requiresAuth: true, notAuth: 'Login'}, component: RentalsPage, name: 'RentalsPage' },
    { path: '/rentals/:id', meta: {requiresAuth: true, notAuth: 'Login'}, component: SingleRental, name: 'SingleRental' },
    { path: '/rentalsStats', meta: {requiresAuth: true, notAuth: 'Login'}, component: RentalsStats, name: 'RentalsStats' },
    { path: '/create', meta: {requiresAuth: true, notAuth: 'Login'}, component: CreateEmployee, name: 'CreateEmployee' },
    { path: '/payments', meta: {requiresAuth: true, notAuth: 'Login'}, component: AddPayment, name: 'AddPayment' },
]

const router = new Router({
    mode: 'history',
    base: 'dashboard',
    routes
})

router.beforeEach(async (to, from, next) => {
    if(to.meta.requiresAuth){
        if(await isLogged()){
            next()
        }
        else{
            next({name: to.meta.notAuth})
        }
    }
    else
        next()
})

export default router