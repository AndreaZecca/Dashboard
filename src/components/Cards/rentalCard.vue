<template>
  <v-card :to="link || ''">
    <v-card-title>Id: {{rental._id}}</v-card-title>
    <v-card-actions>Total: {{rental.estimated.price}}€</v-card-actions>
    <v-card-actions v-if="rental.estimated.summary.length > 0">Price Modification:</v-card-actions>
    <v-card-text>
        <ul>
            <li v-for="discount in rental.estimated.summary" :key="discount">{{discount}}</li>
        </ul>
    </v-card-text>
    <v-card-text>State: {{rental.state}}</v-card-text>
    <v-card-text>From: {{rental.date_start.slice(0,10)}}</v-card-text>
    <v-card-text>To: {{rental.date_end.slice(0,10)}}</v-card-text>
    <v-container class="btnContainer" v-if="onlyRender">
        <v-card-text class="btn"><v-btn class="primary" :to="customerPath+rental.userId" aria-label="Customer Involved in this rental">Customer</v-btn></v-card-text>
        <v-card-text class="btn"><v-btn class="primary" :to="employeePath+rental.functionaryId" aria-label="Employee Involved in this rental">Employee</v-btn></v-card-text>
        <v-card-text class="btn"><v-btn class="primary" :to="articlePath+rental.object_id" aria-label="Product Involved in this rental">Product</v-btn></v-card-text>
    </v-container>
    <v-divider></v-divider>
    <v-container class="badgeContainer">
        <span class="badge" :style="computedStyle" aria-label="Rental's state">{{rental.state}}</span>
    </v-container>
  </v-card>
</template>

<script>
export default {
    name: 'rentalCard',
    props: {
        rental: {
            required: true
        },
        link: {
            type: String,
        },
        onlyRender: {
            type: Boolean,
            default: true
        }
    },
    data (){
        return{
            customerPath: '/customers/',
            articlePath: '/products/',
            employeePath: '/employees/'
        }
    },
    computed: {
        computedStyle(){
            let inner_color = "red"
            let text_color = 'white'
            switch(this.rental.state){
                case "pending":
                    inner_color = "yellow"
                    text_color = 'black'
                    break
                case "approved":
                    inner_color = "green"
                    break
                case "progress":
                    inner_color = "blue"
                    break
                case "ended":
                    inner_color = "purple"
                    break
                case "delayed":
                    inner_color = "red"
                    break
                case "deleted":
                    inner_color = "gray"
                    break
            }
            return {
                '--inner-color': inner_color,
                '--text-color': text_color
            }
        }
    }
}
</script>

<style scoped>
.badgeContainer{
    display: flex;
    justify-content: center;
    align-items: flex-end!important;
    align-content: flex-end!important;
}
.badgeContainer>.badge{
    padding: 5px 15px;
    border-radius: 10px;
    background-color: var(--inner-color);
    color: var(--text-color);
    font-size: 1.2em;
}
.btnContainer{
    display: flex;
    flex-direction: column;
    align-items: stretch!important;
    justify-content: center;
    width: 100%;
}
.btnContainer>.btn{
    width: 100% !important;
    margin: auto;
}
</style>