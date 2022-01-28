<template>
    <v-container>
        <v-container class="controlContainer">
            <v-pagination
                v-model="page"
                circle
                current-page-aria-label
                total-visible="5"
                aria-label="Page number"
                :length="pagesNumber"
            ></v-pagination>
            <v-select
                :items="sortByItems"
                clearable
                v-model="sortBy"
                label="Sort Price By"
            ></v-select>
            <v-menu
                v-model="menuDate"
                :close-on-content-click="false"
                max-width="290"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        role="menuitem"
                        :value="datePeriod"
                        clearable
                        label="Choose Date Period"
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="datePeriod = null"
                    ></v-text-field>
                </template>
                <v-date-picker
                    role="menuitem"
                    v-model="datePeriod"
                    range
                    label="Choose Date Period"
                    @change="menuDate = false"
                ></v-date-picker>
            </v-menu>
            <v-checkbox
                v-for="state in onlyStateFilter"
                :key="state"
                v-model="onlyState"
                :label="state"
                :value="state"
            ></v-checkbox>
            <v-btn class="info" to="/rentalsStats">Stats about rentals</v-btn>
        </v-container>
        <v-container class="cardContainer" fill-height>
            <rentalCard v-for="rental in showedRentals.slice(start, end)" :key="rental._id" :rental="rental" :link="pathForSingleRental+ rental._id" role="link"></rentalCard>
        </v-container> 
    </v-container> 
</template>

<script>
import { getAllRentals } from '../../utility/axios'
import rentalCard from '../Cards/rentalCard.vue'

export default {
    name: 'RentalsPage',
    components: {
        rentalCard,
    },
    data () {
        return {
            allRentals: [],
            showedRentals: [],
            page: 1,
            pagesNumber: 1,
            rentalsPerPage: 8,
            sortByItems: ['Ascending', 'Descending'],
            sortBy: '',
            datePeriod: null,
            onlyStateFilter: [],
            onlyState: [],
            start: 0,
            end: 0,
            pathForSingleRental: '/rentals/',
            menuDate: false,
        }
    },
    watch: {
        rentalsPerPage: function() {
            this.updateToView()
        },
        page: function() { 
            this.updateToView()
        },
        sortBy: function() {
            this.updateToView()
        },
        datePeriod: function() {
            if(this.datePeriod?.length == 2){
                this.page = 1
                this.updateToView()
            } else {
                this.showedRentals = this.allRentals.filter(x => x)
                this.page = 1
                this.updateToView()
            }
        },
        onlyState: function() {
            this.page = 1
            this.updateToView()
        }
    },
    methods : {
        updateToView(){
            this.start = (this.page-1) * this.rentalsPerPage
            this.end = this.start + this.rentalsPerPage
            if(this.onlyState.length > 0){
                this.showedRentals = this.allRentals.filter(x=>this.onlyState.includes(x.state))
            } else {
                this.showedRentals = []
            }
            if(this.sortBy && this.showedRentals.length !== 0){
                const mul = this.sortBy === 'Ascending' ? -1 : 1
                this.showedRentals.sort((a, b) => {
                    if(parseFloat(a.estimated.price)<parseFloat(b.estimated.price))
                        return mul
                    else if(parseFloat(a.estimated.price)>parseFloat(b.estimated.price))
                        return -mul
                    else
                        return 0
              })
            }
            if(this.datePeriod?.length == 2){
                const start = this.datePeriod[0]
                const end = this.datePeriod[1]
                this.showedRentals = this.showedRentals.filter(
                    x => Date.parse(x.date_start) >= Date.parse(start)
                         && Date.parse(x.date_end) <= Date.parse(end)
                )
            }
            this.pagesNumber = Math.ceil(this.showedRentals.length / this.rentalsPerPage) 
        }
    },
    async created(){
        this.allRentals = await getAllRentals();
        
        for(const rental of this.allRentals){
            if(!this.onlyStateFilter.includes(rental.state))
                this.onlyStateFilter.push(rental.state);
        }
        this.onlyState = this.onlyStateFilter.filter(x => x)
        this.updateToView();

        this.isLoaded = true
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
        width: 100%!important;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center!important;
        align-items: stretch!important;
        gap: 1em 1em!important;
    }
    .checkboxContainer{
        align-self: flex-end;
    }
@media screen and (max-width: 1290px) {
    .controlContainer{
        flex-direction: column;
    }
    .controlContainer{
        width: 100%;
    }
}
</style>