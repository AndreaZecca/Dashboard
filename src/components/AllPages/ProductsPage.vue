<template>
  <v-container>
    <v-container class="controlContainer">
      <v-pagination
        v-model="page"
        circle
        aria-label="Page number"
        current-page-aria-label
        :length="pagesNumber"
      ></v-pagination>
      <v-text-field
        v-model="filterName"
        label="Filter by Name"
        clearable
      ></v-text-field>
      <v-select
        :items="sortByItems"
        clearable
        v-model="sortBy"
        label="Sort Price By"
      ></v-select>
      <v-select
        :items="showOnlyItems"
        clearable
        v-model="showOnly"
        label="Show all"
      ></v-select>
      <v-select
        :items="stateFilterOnly"
        clearable
        v-model="stateFilter"
        label="State"
      ></v-select>
      <v-select
        :items="superCatOnly"
        clearable
        v-model="superCat"
        label="SuperCategory"
      ></v-select>
    </v-container>
    <v-container class="cardContainer" fill-height>
      <productCard v-for="product in showedProducts.slice(start, end)" :key="product._id" :product="product" :link="pathForSingleProduct + product._id" role="link"></productCard>
    </v-container>
  </v-container>
</template>

<script>
import { getAllProducts } from '../../utility/axios'
import productCard from '../Cards/productCard.vue'
export default {
    name: 'ProductsPage',
    components: {
      productCard
    },
    data () {
      return {
        page: 1,
        pagesNumber: 1,
        productsPerPage: 5,
        filterName: '',
        sortByItems: ['Ascending', 'Descending'],
        sortBy: '',
        showOnlyItems: [],
        showOnly: '',
        allProducts: [],
        showedProducts: [],
        start: 0,
        end: 0,
        stateFilterOnly: [],
        stateFilter: '',
        superCatOnly: [],
        superCat: '',
        pathForSingleProduct: '/products/'
      }
    },
    watch : {
      productsPerPage: function() {
        this.updateToView()
      },
      page: function() { 
        this.updateToView()
      },
      filterName: function() {
        this.page = 1
        this.updateToView()
      },
      sortBy: function() {
        this.updateToView()
      },
      showOnly: function() {
        this.page = 1
        this.updateToView()
      },
      stateFilter: function() {
        this.page = 1
        this.updateToView()
      },
      superCat: function() {
        this.page = 1
        this.updateToView()
      }
    },
    methods: {
      updateToView(){
        this.start = (this.page - 1) * this.productsPerPage
        this.end = this.start + this.productsPerPage
        if(this.filterName)
          this.showedProducts = this.allProducts.filter(x=>x.name.toLowerCase().includes(this.filterName.toLowerCase()))
        else
          this.showedProducts = this.allProducts.filter(x=>x)
        if(this.sortBy){
          const mul = this.sortBy === 'Ascending' ? -1 : 1
          this.showedProducts.sort( (a,b) => {
            if(parseFloat(a.price) < parseFloat(b.price)) return mul
            else if(parseFloat(a.price) > parseFloat(b.price)) return -mul
            else return 0
          })
        }
        if(this.showOnly)
          this.showedProducts = this.showedProducts.filter(x => x.category === this.showOnly)
        if(this.stateFilter)
          this.showedProducts = this.showedProducts.filter(x => x.state === this.stateFilter)
        if(this.superCat)
          this.showedProducts = this.showedProducts.filter(x => x.superCategory === this.superCat)
        this.pagesNumber = Math.ceil(this.showedProducts.length / this.productsPerPage) 
      }
    },
    async created () {
      this.allProducts = await getAllProducts()
      for(const prod of this.allProducts) {
        if(!this.showOnlyItems.includes(prod.category))
          this.showOnlyItems.push(prod.category)
        if(!this.stateFilterOnly.includes(prod.state))
          this.stateFilterOnly.push(prod.state)
        if(!this.superCatOnly.includes(prod.superCategory))
          this.superCatOnly.push(prod.superCategory)
      }
      this.updateToView()
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
    width: 90%!important;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center!important;
    align-items: stretch!important;
    gap: 1em 1em!important;
  }
  @media screen and (max-width: 1290px) {
    .controlContainer{
      flex-direction: column;
    }
    .controlContainer{
      width: 90%;
    }
  }
</style>