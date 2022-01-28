<template>
    <v-container>
        <v-row>
            <v-col>
                <personCard v-if="customer" :user="customer" type="customers"/>
            </v-col>
            <v-col v-if="isLoaded">
                <v-card height="100%">
                    <v-card-title>Info about customer: {{customer.name + " " + customer.surname}}</v-card-title>
                    <v-card-actions>Total spent over time: {{totalSpent}}€</v-card-actions>
                    <v-card-actions>Total number of rentals: {{rentals.length}}</v-card-actions>
                    <v-card-actions>Products mostly rented: {{maxProduct}}</v-card-actions>
                    <v-card-actions>Supercategory preferred: {{maxSuperCat}}</v-card-actions>
                    <v-card-actions>Max spent for a single rent: {{maxSpent}}€</v-card-actions>
                    <v-card-actions>Min spent for a single rent: {{minSpent}}€</v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-container class="chartContainer">
                <BarChar v-if="isLoaded" :title="stateTitle" :labels="stateLabel" :chartdata="stateData" :options="chartOptions" aria-label="State of Rentals"></BarChar>
                <BarChar v-if="isLoaded" :title="nameProdTitle" :labels="nameProdLabel" :chartdata="nameProdData" :options="chartOptions" aria-label="Products rented"></BarChar>
                <PieChart v-if="isLoaded" :title="superCatTitle" :labels="superCatLabel" :chartdata="superCatData" :options="chartOptions" aria-label="Super Categories rented"></PieChart>
                <LineChart v-if="isLoaded" :title="lineTitle" :labels="lineLabel" :chartdata="lineData" :options="chartOptions" aria-label="Spending over time"></LineChart>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
import personCard from '../Cards/personCard.vue'

import BarChar from '../graphs/BarChart.vue'
import PieChart from '../graphs/PieChart.vue'
import LineChart from '../graphs/LineChart.vue'

import { getSingleUser, getRentalsOfUser } from '../../utility/axios'
import { statsByRentals, computeChartByObjField, computeChartByRentalPriceOrNumber } from '../../utility/helper'

export default {
    name: 'SingleCustomer',
    components: {
        personCard,
        BarChar,
        PieChart,
        LineChart
    },
    data () {
        return {
            id: this.$route.params.id,
            customer: null,
            rentals: null,
            products: [],
            totalSpent: 0,
            maxProduct: '',
            maxSpent: 0,
            minSpent: 0,
            maxSuperCat: '',

            stateData: [], stateLabel: [], stateTitle: "State of rentals",
            nameProdData: [], nameProdLabel: [], nameProdTitle: 'Products rented',
            superCatData: [], superCatLabel: [], superCatTitle: "Supercategories rented",
            lineData: [], lineLabel: [], lineTitle: "Spending over time",

            isLoaded: false,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
        }
    },
    async created () {
        this.customer = await getSingleUser(this.$route.params.id)
        this.rentals = await getRentalsOfUser(this.id)
        
        this.totalSpent = this.rentals.reduce((p,c) => p + parseFloat(c.estimated.price), 0).toFixed(2)
        this.maxSpent = this.rentals.length > 0 ? Math.max.apply(Math, this.rentals.map(function(o) { return o.estimated.price })) : 0
        this.minSpent = this.rentals.length > 0 ? Math.min.apply(Math, this.rentals.map(function(o) { return o.estimated.price })) : 0

        const rentalStats = await statsByRentals(this.rentals)

        const state = computeChartByObjField({objs: this.rentals, field: 'state'})
        this.stateData = state.chartdata
        this.stateLabel = state.labels

        const name = computeChartByObjField({objs: rentalStats.productsStats.products, frequency: rentalStats.productsStats.productsFrequency, field: 'name'})
        this.nameProdData = name.chartdata
        this.nameProdLabel = name.labels
        this.maxProduct = this.nameProdLabel[this.nameProdData.indexOf(Math.max(...this.nameProdData))]

        const superCategory = computeChartByObjField({objs: rentalStats.productsStats.products, frequency: rentalStats.productsStats.productsFrequency, field: 'superCategory'})
        this.superCatData = superCategory.chartdata
        this.superCatLabel = superCategory.labels
        this.maxSuperCat = this.superCatLabel[this.superCatData.indexOf(Math.max(...this.superCatData))]

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
        background-color: white!important;
        border-radius: 2em;
        padding: 0.5em!important;
        width: 45%!important;
    }
    @media screen and (max-width: 1290px){
        .chartContainer>*{
            width: 100%!important;
        }
    }
</style>