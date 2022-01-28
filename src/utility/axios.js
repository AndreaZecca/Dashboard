import axios from 'axios'
const deploy = true
const baseUrl = deploy ? 'https://site202129.tw.cs.unibo.it' : 'http://localhost:8000'
const loginUrl = baseUrl + '/api/auth/login/staff?role=admin'
const customerUrl = baseUrl + '/api/users'
const employeeUrl = baseUrl + '/api/staff'
const productsUrl = baseUrl + '/api/articles'
const rentalsUrl = baseUrl + '/api/rentals'
const paymentUrl = baseUrl + '/api/paymentmethods'

const ACCESS_TOKEN_STORAGE = 'token'


const standardHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'mode': 'cors'
};

const advancedHeaders = {
    ...standardHeaders,
    'authority': JSON.stringify(localStorage[ACCESS_TOKEN_STORAGE]) || JSON.stringify(sessionStorage[ACCESS_TOKEN_STORAGE])
}

function getBasePathImg(){
    return deploy ? 'https://site202129.tw.cs.unibo.it' : 'http://localhost:8000'
}

async function login(username, password){
    try {
        const response =  await axios.post(loginUrl, {username, password}, {standardHeaders})
        const accessToken = response.data.authority
        return { accessToken }
    } catch (err) {
        return { error: err.response.data.message }
    }
}

function generateAdvancedHeader() {
    advancedHeaders['authority'] = JSON.stringify(localStorage[ACCESS_TOKEN_STORAGE]) || JSON.stringify(sessionStorage[ACCESS_TOKEN_STORAGE])
}

async function getUsers(){
    try {
        generateAdvancedHeader()
        const response = await axios.get(customerUrl, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getSingleUser(userId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${customerUrl}/${userId}`, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getRentalsOfUser(userId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${customerUrl}/${userId}/rentals`, {headers: {...advancedHeaders}})
        return response.data.sort((a,b) => {
            if(a.date_start < b.date_start) return -1;
            else if(a.date_start > b.date_start) return 1
            else return 0
        })
    } catch (err) {
        return []
    }
}

async function getEmployees(){
    try {
        generateAdvancedHeader()
        const response = await axios.get(employeeUrl, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getSingleEmployee(employeeId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${employeeUrl}/${employeeId}`, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getRentalsOfEmployee(employeeId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${employeeUrl}/${employeeId}/rentals`, {headers: {...advancedHeaders}})
        return response.data.sort((a,b) => {
            if(a.date_start < b.date_start) return -1;
            else if(a.date_start > b.date_start) return 1
            else return 0
        })
    } catch (err) {
        return []
    }
}

async function modifyEmployeeData(newData, employeeId){
    try {
        generateAdvancedHeader()
        const response = await axios.patch(`${employeeUrl}/${employeeId}`, newData, {headers: {...advancedHeaders}})
        return response
    } catch (err) {
        return []
    }
}

async function deleteEmployee(employeeId){
    try {
        generateAdvancedHeader()
        const response = await axios.delete(`${employeeUrl}/${employeeId}`, {headers: {...advancedHeaders}})
        return response
    } catch (err) {
        return []
    }
}

async function createEmployee(data){
    try {
        generateAdvancedHeader()
        const response = await axios.post(`${employeeUrl}`, data, {headers: {...advancedHeaders}})
        return response
    } catch (err) {
        return []
    }
}

async function getAllProducts(){
    try {
        generateAdvancedHeader()
        const response = await axios.get(productsUrl, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getSingleProduct(prodId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${productsUrl}/${prodId}`, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getRentalOfProduct(prodId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${productsUrl}/${prodId}/rentals`, {headers: {...advancedHeaders}})
        return response.data.sort((a,b) => {
            if(a.date_start < b.date_start) return -1;
            else if(a.date_start > b.date_start) return 1
            else return 0
        })
    } catch (err) {
        return []
    }
}

async function getAllRentals(){
    try {
        generateAdvancedHeader()
        const response = await axios.get(rentalsUrl, {headers: {...advancedHeaders}})
        return response.data.sort((a,b) => {
            if(a.date_start < b.date_start) return -1;
            else if(a.date_start > b.date_start) return 1
            else return 0
        })
    } catch (err) {
        return []
    }
}

async function getSingleRental(rentalId){
    try {
        generateAdvancedHeader()
        const response = await axios.get(`${rentalsUrl}/${rentalId}`, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function getPayments(){
    try{
        generateAdvancedHeader()
        const response = await axios.get(`${paymentUrl}`, {headers: {...advancedHeaders}})
        return response.data
    } catch (err) {
        return []
    }
}

async function deletePayment(paymentId){
    try {
        generateAdvancedHeader()
        const response = await axios.delete(`${paymentUrl}/${paymentId}`, {headers: {...advancedHeaders}})
        return response
    } catch (err) {
        return []
    }
}

async function createPayment(data){
    try {
        const response = await axios.post(`${paymentUrl}`, data, {headers:{ 
    'authority': JSON.stringify(localStorage[ACCESS_TOKEN_STORAGE]) || JSON.stringify(sessionStorage[ACCESS_TOKEN_STORAGE])

        }} )
        return response
    } catch (err) {
        return []
    }
}

export {
    getBasePathImg,
    login, 
    getUsers, getSingleUser, getRentalsOfUser,
    getEmployees, getSingleEmployee, modifyEmployeeData, getRentalsOfEmployee, deleteEmployee, createEmployee,
    getAllProducts, getSingleProduct, getRentalOfProduct,
    getAllRentals, getSingleRental,
    getPayments, deletePayment, createPayment
}