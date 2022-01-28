<template>
    <v-container class="homeContainer" fill-height>
        <v-card class="cardBasis" v-for="card in cards" :key="card.title" :to="card.path" role="link">
            <v-img :src="card.imgPath" aspect-ratio="2.5" width="auto" :alt="`Image for section ${card.title}`"></v-img>
            <v-card-title>{{card.title}}</v-card-title>
            <v-card-subtitle>{{card.description}}</v-card-subtitle>
        </v-card>
    </v-container>
</template>
    
<script>
export default {
    name: 'Home',
    data () {
        return {
            cards: [
                {title: 'Customers', imgPath: require('@/assets/Customers.png'), description: 'Show stats about the customers', path:'/customers'},
                {title: 'Employees', imgPath: require('@/assets/Employees.png'), description: 'Show stats about the employees', path:'/employees'},
                {title: 'Products', imgPath: require('@/assets/Products.png'), description: 'Show stats about the products', path:'/products'},
                {title: 'Rentals', imgPath: require('@/assets/Rentals.png'), description: 'Show stats about the rentals', path:'/rentals'},
            ]
        }
    }
}
</script>

<style scoped>
.homeContainer{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1em 1em!important;
}
.cardBasis{
    width: 45%!important;
}
@media screen and (max-width:990px){
    .homeContainer{
        flex-direction: column;
        justify-content: stretch;
    }
    .cardBasis{
        width: 90%!important;
    }
}
</style>