<template>
    <v-container class="cardContainer">
        <personCard v-if="customer" :user="customer" type="customers" :link="customerPath+customer._id" aria-label="Info about customer"></personCard>
        <personCard v-if="employee" :user="employee" type="employees" :link="employeePath+employee._id" aria-label="Info about employee"></personCard>
        <productCard v-if="product" :product="product" :link="productPath+product._id" aria-label="Info about product"></productCard>
        <rentalCard v-if="rental" :rental="rental" :onlyRender="false" aria-label="Info about rental bill"></rentalCard>
    </v-container>
</template>

<script>
import personCard from '../Cards/personCard.vue'
import productCard from '../Cards/productCard.vue'
import rentalCard from '../Cards/rentalCard.vue'
import { getSingleRental, getSingleProduct, getSingleUser, getSingleEmployee } from '../../utility/axios'
export default {
    name: 'SingleRental',
    components: {
        personCard,
        productCard,
        rentalCard
    },
    data () {
        return {
            id: this.$route.params.id,
            rental: null,
            customer: null,
            employee: null,
            product: null,
            customerPath: '/customers/',
            employeePath: '/employees/',
            productPath: '/products/',
        }
    },
    async created(){
        this.rental = await getSingleRental(this.id)
        this.customer = await getSingleUser(this.rental.userId)
        this.employee = await getSingleEmployee(this.rental.functionaryId)
        this.product = await getSingleProduct(this.rental.object_id)
    }
}
</script>

<style scoped>
.cardContainer{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch!important;
    gap: 1em 1em!important;
  }
</style>