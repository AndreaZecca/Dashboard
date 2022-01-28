<template>
    <v-card :to="link || ''">
        <v-alert v-if="alertMessage" dense :type="alertType">{{alertMessage}}</v-alert>
        <v-container class="badgeContainer">
            <v-img :src="avatarPath" width="300px" :alt="`Profile picture of ${user.surname} ${user.name}`"></v-img>
            <span :style="computedStyle" class="badge" v-if="user.role" aria-label="Employee role">{{user.role.toUpperCase()}}</span>
        </v-container>
        <v-card-title>{{user.name+' '+user.surname}}</v-card-title>
        <v-card-subtitle>Username: {{user.username}}</v-card-subtitle>
        <v-card-text v-if="user.residence">Lives in: {{user.residence}}</v-card-text>
        <v-card-text v-if="user.paymentmethod">Payment: {{user.paymentmethod}}</v-card-text>
        <v-card-text>Id: {{user._id}}</v-card-text>
        <span v-if="!onlyRender && user.role && user._id !== loggedId" class="optionalInfo">
            <v-switch class="ml-2" v-on:click.prevent="changeRole" v-model="roleChanger" :label="`${user.role === 'admin' ? 'Admin' : 'Employee'}`" aria-label="Modify employee role"></v-switch>
            <v-btn class="ma-2" color="red" dark v-on:click.prevent="deleteCurrentEmployee" aria-label="Delete employee"> Delete <v-icon right> mdi-cancel </v-icon></v-btn>
        </span>
    </v-card>
</template>

<script>
import { getBasePathImg, modifyEmployeeData, deleteEmployee } from '../../utility/axios'
import { getPersonalId } from '../../utility/auth'
export default {
    name: 'personCard',
    props: {
        user: {
            required: true
        },
        type: {
            type: String,
            enum: ['customers', 'employees']
        },
        link: {
            type: String,
        },
        onlyRender: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return{
            avatarPath: `${getBasePathImg()}/img/${this.type}Avatar/${this.user.avatar || (this.type==='customers' ? "defaultCustomer.jpg" : "defaultEmployee.jpg")}`,
            roleChanger: this.user.role === 'admin' ? true : false,
            alertMessage: '',
            alertType: '',
            loggedId: null,
        }
    },
    computed: {
        computedStyle () {
            return {
                '--inner-color':  this.user.role && this.user.role === 'admin' ? 'red' : 'yellow',
                '--badge-text-color': this.user.role && this.user.role === 'admin' ? 'white' : 'black',
            }
        }
    },
    async created () {
        this.loggedId = await getPersonalId()
    },
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async changeRole () {
            let toSend = new FormData()
            toSend.append('role', this.roleChanger ? 'admin' : 'employee')
            const res = await modifyEmployeeData(toSend, this.user._id)
            if(res.status === 200){
                this.alertType = 'success'
                this.alertMessage = 'Modify success. Refreshing the page'
                await this.sleep(1500)
                this.$router.go(0)
            } else {
                this.alertType = 'error'
                this.alertMessage = 'Modify error. Redirecting to Home'
                await this.sleep(1500)
                this.$router.push({path: '/'})
            }
        },
        async deleteCurrentEmployee(){
            const res = await deleteEmployee(this.user._id)
            if(res.status === 200){
                this.alertType = 'success'
                this.alertMessage = 'Delete success. Refreshing the page'
                await this.sleep(1500)
                this.$router.go(0)
            } else {
                this.alertType = 'error'
                this.alertMessage = 'Delete error. Redirecting to Home'
                await this.sleep(1500)
                this.$router.push({path: '/'})
            }
        }
    }
}
</script>

<style scoped>
.badgeContainer{
    position: relative;
}
.badgeContainer>.badge{
    position: absolute;
    top:5px;
    right: 5px;
    padding: 5px 15px;
    border-radius: 10px;
    background-color: var(--inner-color);
    color: var(--badge-text-color);
    font-size: 1.2em;
}
.optionalInfo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
}
</style>