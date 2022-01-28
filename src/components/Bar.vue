<template>
  <div>
      <nav>
        <v-app-bar app dark>
            <v-app-bar-nav-icon aria-label="SideTab" @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
            <v-toolbar-title><v-btn to="/">Dashboard</v-btn></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="switchDarkMode">
                <label class='lgonly'>{{ $vuetify.theme.dark ? 'Light' : 'Night'}} Mode</label>
                <v-icon aria-label="DarkMode" role="img" aria-hidden="false">
                {{icons.mdiBrightness4}}
                </v-icon>
            </v-btn>
            <v-btn @click="logout" v-if="authenticated">
                <label for="logout" class='lgonly'>Logout</label>
                <v-icon aria-label="Logout" role="img" aria-hidden="false" id="logout">
                {{icons.mdiLogoutVariant}}
                </v-icon>
            </v-btn>
        </v-app-bar>
    </nav>
    <v-navigation-drawer app v-model="drawer" v-if="drawer">
        <v-list-item>
            <v-list-item-content>
            <v-list-item-title class="text-h6">
                NoloNolo+
            </v-list-item-title>
            <v-list-item-subtitle>
                Dashboard
            </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
            <v-list-item v-for="sideTab in sideTabs" :key="sideTab.index">
                <v-list-item-icon>
                    <v-icon :aria-label="sideTab.name" role="img" aria-hidden="false">{{ sideTab.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title><v-btn :to="sideTab.path">{{ sideTab.name }}</v-btn></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mdiLogoutVariant, mdiHome, mdiBriefcase, mdiAccountGroup, mdiBasket, mdiCashCheck, mdiAccountHardHat, mdiBrightness4, mdiSword, mdiGreasePencil, mdiCurrencyUsd } from '@mdi/js'

export default {
    name: 'Bar',
    props: {
        authenticated: Boolean
    },
    data () {
        return{
            drawer: Boolean,
            icons: {mdiBrightness4, mdiLogoutVariant},
            sideTabs: [ { name: 'Home', path: '/', icon: mdiHome },  
                        { name: 'Front Office', path: '/loginCustomer', icon: mdiSword },
                        { name: 'Back Office', path: '/loginEmployee', icon: mdiBriefcase } ]
        }
    },
    watch: {
        authenticated() {
            if (this.authenticated) {
                this.sideTabs.push({name: 'Customers', path:'/customers', icon: mdiAccountGroup})
                this.sideTabs.push({name: 'Employees', path:'/employees', icon: mdiAccountHardHat})
                this.sideTabs.push({name: 'Rentals', path:'/rentals', icon: mdiCashCheck})
                this.sideTabs.push({name: 'Products', path:'/products', icon: mdiBasket})
                this.sideTabs.push({name: 'Modify Data', path:'/modify', icon: mdiGreasePencil})
                this.sideTabs.push({name: 'Add Payment', path:'/payments', icon: mdiCurrencyUsd})
            }
        }
    },
    created(){
        this.drawer = false  
    },
    methods: {
      logout () {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            this.$router.go({path: '/login'})
        },
        switchDarkMode () {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        }
    }
}
</script>

<style scoped>
@media screen and (max-width: 666px){
    .lgonly {
        display: none!important;
    }
}
</style>