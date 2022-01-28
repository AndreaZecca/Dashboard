<template>
  <v-container>
    <v-container class="controlContainer">
      <v-pagination
      v-model="page"
      circle
      current-page-aria-label
      :length="pagesNumber"
      aria-label="Page Number"
      ></v-pagination>
      <v-text-field
          v-model="filterUsername"
          label="Filter by Username"
          clearable
          class="filterText"
      ></v-text-field>
      <v-select
          :items="sortByItems"
          clearable
          v-model="sortBy"
          label="Sort Username By"
      ></v-select>
    </v-container>
    <v-container class="cardContainer" fill-height>
      <personCard v-for="customer in showedCustomers.slice(start, end)" :key="customer._id" :user="customer" type="customers" :link="singleCustomerPath+customer._id" role="link"/>
    </v-container>
  </v-container>
</template>

<script>
import { getUsers } from '../../utility/axios'
import personCard from '../Cards/personCard.vue'

export default {
    name: 'CustomersPage',
    components: {
      personCard
    },
    data () {
      return {
        allCustomers: [],
        showedCustomers: [],
        page: 1,
        customersPerPage: 5,
        pagesNumber: 0,
        start: 0,
        end: 0,
        filterUsername: '',
        sortByItems: ['Ascending', 'Descending'],
        sortBy: '',
        singleCustomerPath: '/customers/',
      }
    },
    watch : {
      customersPerPage: function() {
        this.updateToView()
      },
      page: function() { 
        this.updateToView()
      },
      filterUsername: function() {
        this.page = 1
        this.updateToView()
      },
      sortBy: function() {
        this.updateToView()
      }
    },
    async created () {
      this.allCustomers = (await getUsers())
      this.pagesNumber = Math.ceil(this.allCustomers.length / this.customersPerPage) 
      this.updateToView()
    },
    methods: {
      updateToView (){
        this.start = (this.page-1) * this.customersPerPage
        this.end = this.start + this.customersPerPage
        if(this.filterUsername){
          this.showedCustomers = this.allCustomers.filter(x => x.username.toLowerCase().includes(this.filterUsername.toLowerCase()))
        } else {
          this.showedCustomers = this.allCustomers.filter(x => x)
        }
        if(this.sortBy){
          const mul = this.sortBy === 'Ascending' ? -1 : 1
          this.showedCustomers.sort( (a,b) => {
            if(a.username.toLowerCase() < b.username.toLowerCase()) return mul
            else if(a.username.toLowerCase() > b.username.toLowerCase()) return -mul
            else return 0
          })
        }
        this.pagesNumber = Math.ceil(this.showedCustomers.length / this.customersPerPage) 
      }
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
  .controlContainer{
    display: flex;
    width: 90%!important;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center!important;
    align-items: stretch!important;
    gap: 1em 1em!important;
  }
  @media screen and (max-width: 1290px) {
    .controlContainer{
      flex-direction: column;
      width: 90%;
    }
  }
</style>