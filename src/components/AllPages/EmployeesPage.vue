<template>
  <v-container>
    <v-container class="controlContainer">
      <v-pagination
        v-model="page"
        circle
        aria-label="Page Number"
        current-page-aria-label
        :length="pagesNumber"
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
      <v-select
        :items="showOnlyItems"
        clearable
        v-model="showOnly"
        label="Show all"
      ></v-select>
      <v-btn class="info" to="/create" aria-label="Create Employee">Create Employee</v-btn>
    </v-container>
    <v-container class="cardContainer" fill-height>
      <personCard v-for="employee in showedEmployees.slice(start, end)" :key="employee._id" :onlyRender="false" :user="employee" type="employees" :link="pathForSingleEmployee+employee._id" role="link"/>
    </v-container>
  </v-container>
</template>

<script>
import { getEmployees } from '../../utility/axios'
import personCard from '../Cards/personCard.vue'
export default {
    name: 'EmployeesPage',
    components: {
      personCard
    },
    data () {
      return {
        allEmployees: [],
        showedEmployees: [],
        page: 1,
        employeesPerPage: 5,
        pagesNumber: 0,
        start: 0,
        end: 0,
        filterUsername: '',
        sortByItems: ['Ascending', 'Descending'],
        sortBy: '',
        showOnlyItems: ['Employee', 'Admin'],
        showOnly: '',
        pathForSingleEmployee: '/employees/'
      }
    },
    watch : {
      employeesPerPage: function() {
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
      },
      showOnly: function() {
        this.page = 1
        this.updateToView()
      }
    },
    async created () {
      this.allEmployees = (await getEmployees())
      this.updateToView()
    },
    methods: {
      updateToView (){
        this.start = (this.page-1) * this.employeesPerPage
        this.end = this.start + this.employeesPerPage
        if(this.filterUsername){
          this.showedEmployees = this.allEmployees.filter(x => x.username.toLowerCase().includes(this.filterUsername.toLowerCase()))
        } else {
          this.showedEmployees = this.allEmployees.filter(x => x)
        }
        if(this.sortBy){
          const mul = this.sortBy === 'Ascending' ? -1 : 1
          this.showedEmployees.sort( (a,b) => {
            if(a.username.toLowerCase() < b.username.toLowerCase()) return mul
            else if(a.username.toLowerCase() > b.username.toLowerCase()) return -mul
            else return 0
          })
        }
        if(this.showOnly)
          this.showedEmployees = this.showedEmployees.filter(x => x.role===this.showOnly.toLowerCase())
        this.pagesNumber = Math.ceil(this.showedEmployees.length / this.employeesPerPage) 
      },
      
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
      width: 90%;
    }
  }
</style>