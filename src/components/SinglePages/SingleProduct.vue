<template>
    <v-container v-if="product">
        <v-row>
            <v-col>
                <productCard v-if="product" :product="product"/>
            </v-col>
            <v-col>
                <v-card height="100%">
                    <v-card-title>Info about product: {{product.name}}</v-card-title>
                    <v-card-actions>Total earned over time: {{totalEarned}}€</v-card-actions>
                    <v-card-actions>Total number of rentals: {{rentals.length}}</v-card-actions>
                    <v-card-actions>The product was mostly rented by (customer): {{maxCustomer}}</v-card-actions>
                    <v-card-actions>The product was mostly rented by (employee): {{maxEmployee}}</v-card-actions>
                    <v-card-actions>Max earned for a single rent: {{maxEarned}}€</v-card-actions>
                    <v-card-actions>Min earned for a single rent: {{minEarned}}€</v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-container class="chartContainer">
                <BarChar v-if="isLoaded" :title="customerTitle" :labels="customerLabel" :chartdata="customerData" :options="chartOptions" aria-label="Customers who rented this products the most"></BarChar>
                <BarChar v-if="isLoaded" :title="employeeTitle" :labels="employeeLabel" :chartdata="employeeData" :options="chartOptions" aria-label="Employees who sold this products the most"></BarChar>
                <PieChart v-if="isLoaded" :title="stateTitle" :labels="stateLabel" :chartdata="stateData" :options="chartOptions" aria-label="State of rentals"></PieChart>
                <LineChart v-if="isLoaded" :title="lineTitle" :labels="lineLabel" :chartdata="lineData" :options="chartOptions" aria-label="Income over time"></LineChart>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
import productCard from '../Cards/productCard.vue'

import BarChar from '../graphs/BarChart.vue'
import PieChart from '../graphs/PieChart.vue'
import LineChart from '../graphs/LineChart.vue'

import { getSingleProduct, getRentalOfProduct } from '../../utility/axios'
import { statsByRentals, computeChartByObjField, computeChartByRentalPriceOrNumber } from '../../utility/helper'

export default {
    name: 'SingleProduct',
    components: {
        productCard,
        BarChar,
        PieChart,
        LineChart
    },
    data () {
        return{
            id: this.$route.params.id,
            product: null,
            employee: [],
            customers: [],
            rentals: [],
            totalEarned: 0,
            maxCustomer: '',
            maxEmployee: '',
            maxEarned: '',
            minEarned: '',

            stateData: [], stateLabel: [], stateTitle: "State of rentals",
            employeeData: [], employeeLabel: [], employeeTitle: "Employees who sold most time",
            customerData: [], customerLabel: [], customerTitle: "Customer who rented most time",
            lineData: [], lineLabel: [], lineTitle: "Income over time",

            isLoaded: false,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
        }
    },
    async created () {

        this.product = await getSingleProduct(this.$route.params.id)
        this.rentals = await getRentalOfProduct(this.id)
        
        this.totalEarned = this.rentals.reduce((p,c) => p + parseFloat(c.estimated.price), 0).toFixed(2)
        this.maxEarned = this.rentals.length > 0 ? Math.max.apply(Math, this.rentals.map(function(o) { return o.estimated.price })) : 0
        this.minEarned = this.rentals.length > 0 ? Math.min.apply(Math, this.rentals.map(function(o) { return o.estimated.price })) : 0

        const rentalStats = await statsByRentals(this.rentals)

        const state = computeChartByObjField({objs: this.rentals, field: 'state'})
        this.stateData = state.chartdata
        this.stateLabel = state.labels

        const name = computeChartByObjField({objs: rentalStats.employeesStats.employees, frequency: rentalStats.employeesStats.employeesFrequency, field: 'username'})
        this.employeeData = name.chartdata
        this.employeeLabel = name.labels
        this.maxEmployee = this.employeeLabel[this.employeeData.indexOf(Math.max(...this.employeeData))]

        const superCategory = computeChartByObjField({objs: rentalStats.customersStats.customers, frequency: rentalStats.customersStats.customersFrequency, field: 'username'})
        this.customerData = superCategory.chartdata
        this.customerLabel = superCategory.labels
        this.maxCustomer = this.customerLabel[this.customerData.indexOf(Math.max(...this.customerData))]

        const lineDate = computeChartByRentalPriceOrNumber(this.rentals, true)
        this.lineData = lineDate.chartdata
        this.lineLabel = lineDate.labels
        
        this.isLoaded = true
    }
}
</script>

<style scoped>
    .chartContainer{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
        width: 100%!important;
        justify-content: center;
        align-items: center;
    }
    .chartContainer>*{
        border-radius: 2em;
        background-color: white!important;
        padding: 0.5em!important;
        width: 45%!important;
    }
    @media screen and (max-width: 1290px){
        .chartContainer>*{
            width: 100%!important;
        }
    }
</style>