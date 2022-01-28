<template>
  <v-container v-if="isLoaded" class="chartContainer">
        <LineChart :chartdata="earnTimeData" :labels="earnTimeLabels" :title="earnTimeTitle" :options="chartOptions" aria-label="Earning over time"/> 
        <LineChart :chartdata="numberTimeData" :labels="numberTimeLabels" :title="numberTimeTitle" :options="chartOptions" :beginAtZero="true" aria-label="Number of rentals over time"/> 
        
        <div class="myrow">
            <BarChart :chartdata="customersData" :labels="custumersLabels" :title="customersTitle" :options="chartOptions" aria-label="Customers number of rentals"/>
            <BarChart :chartdata="employeesData" :labels="employeesLabels" :title="employeesTitle" :options="chartOptions" aria-label="Employees number of rentals"/>
        </div>
        
        <!-- <BarChart :chartdata="productsData" :labels="productsLabels" :title="productsTitle" :options="chartOptions" /> -->
        <div class="myrow">
            <PieChart :chartdata="categoriesData" :labels="categoriesLabels" :title="categoriesTitle" :options="chartOptions" aria-label="Categories number of rentals"/>
            <PieChart :chartdata="superCategoriesData" :labels="superCategoriesLabels" :title="superCategoriesTitle" :options="chartOptions" aria-label="Super categories number of rentals"/>
        </div>
  </v-container>
</template>

<script>
import { getAllRentals } from '../../utility/axios'
import { statsByRentals, computeChartByRentalPriceOrNumber, computeChartByObjField }from '../../utility/helper' 

import LineChart from '../graphs/LineChart.vue'
import BarChart from '../graphs/BarChart.vue'
import PieChart from '../graphs/PieChart.vue'

export default {
    name: 'RentalsStats',
    components: {
        LineChart,
        BarChart,
        PieChart
    },
    data () {
        return {
            rentals: [],
            isLoaded: false,
            chartOptions: { responsive: true, maintainAspectRatio: false },

            earnTimeData: [], earnTimeLabels: [], earnTimeTitle: 'Earning over time',
            numberTimeData: [], numberTimeLabels: [], numberTimeTitle: 'Number of rentals over time',
            customersData: [], customersLabels: [], customersTitle: 'Customers number of rentals',
            employeesData: [], employeesLabels: [], employeesTitle: 'Employees number of rentals',
            // productsData: [], productsLabels: [], productsTitle: 'Products number of rentals',
            categoriesData: [], categoriesLabels: [], categoriesTitle: 'Categories number of rentals',
            superCategoriesData: [], superCategoriesLabels: [], superCategoriesTitle: 'Super categories number of rentals',
        }
    },
    async created () {
        this.rentals = await getAllRentals()
        const rentalStats = await statsByRentals(this.rentals)

        const earnTime = computeChartByRentalPriceOrNumber(this.rentals, true)
        this.earnTimeData = earnTime.chartdata
        this.earnTimeLabels = earnTime.labels
        
        const numberTime = computeChartByRentalPriceOrNumber(this.rentals, false)
        this.numberTimeData = numberTime.chartdata
        this.numberTimeLabels = numberTime.labels
        
        const customersData = computeChartByObjField({objs: rentalStats.customersStats.customers, frequency: rentalStats.customersStats.customersFrequency, field:'username'})
        this.customersData = customersData.chartdata
        this.custumersLabels = customersData.labels
        
        const employeesData = computeChartByObjField({objs: rentalStats.employeesStats.employees, frequency: rentalStats.employeesStats.employeesFrequency, field:'username'})
        this.employeesData = employeesData.chartdata
        this.employeesLabels = employeesData.labels

        // const productsData = computeChartByObjField({objs: rentalStats.productsStats.products, frequency: rentalStats.productsStats.productsFrequency, field:'name'})
        // this.productsData = productsData.chartdata
        // this.productsLabels = productsData.labels

        const categoriesData = computeChartByObjField({objs: rentalStats.productsStats.products, frequency: rentalStats.productsStats.productsFrequency, field:'category'})
        this.categoriesData = categoriesData.chartdata
        this.categoriesLabels = categoriesData.labels

        const superCategoriesData = computeChartByObjField({objs: rentalStats.productsStats.products, frequency: rentalStats.productsStats.productsFrequency, field:'superCategory'})
        this.superCategoriesData = superCategoriesData.chartdata
        this.superCategoriesLabels = superCategoriesData.labels

        this.isLoaded = true
    }
}
</script>

<style scoped>
    .chartContainer{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%!important;
        gap: 1em 1em!important;
    }
    .chartContainer>*{
        background-color: white!important;
        border-radius: 2em!important;
        padding: 0.5em!important;
        width: 100%!important;
    }
    .myrow {
        display: flex;
        flex-direction: row!important;
        width: 100%!important;
        gap: 1em 1em!important;
        align-items: center;
        justify-content: center;
        background-color: transparent !important;
    }
    .myrow > * {
        width: 50%!important;
        margin: auto!important;
        border-radius: 2em!important;
        background-color: white!important;
    }
    @media screen and (max-width: 1290px){
        .chartContainer>*{
            width: 100%!important;
        }
        .myrow{
            flex-direction: column!important;
        }
        .myrow>* {
            width: 100%!important;
        }
    }
</style>