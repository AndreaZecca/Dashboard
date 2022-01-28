<template>
    <v-container fluid justify-center class="formContainer" :style="computedStyle">
        <form class="paymentForm">
            <fieldset class="myFieldset">
                <legend>Add/Remove Payment methods</legend>
                <v-alert v-if="alertMessage" dense :type="alertType" role="alert" aria-label="Message to notify success or error in payment method's creation">{{alertMessage}}</v-alert>
                <v-container v-for="payment in payments" :key="payment._id" class="paymentContainer">
                    <span>{{payment.name}}</span>
                    <v-btn color="error" @click.prevent="deletePayment(payment._id)">DELETE</v-btn>
                </v-container>
                <v-container class="newContainer">
                    <v-text-field
                        v-model="newPayment"
                        label="Insert new Payment"
                        autofocus
                        required
                    >
                    </v-text-field>
                    <v-btn class="mr-4 mb-4 success" @click.prevent="createHandler" :disabled="!newPayment">
                        <label>Create</label>
                    </v-btn>
                </v-container>
            </fieldset>
        </form>
    </v-container>
</template>

<script>
import { getPayments, deletePayment, createPayment } from '../../utility/axios'
export default {
    name: 'AddPayment',
    data() {
        return { 
            payments: [],
            newPayment: '',
            alertType: '',
            alertMessage: ''
        }
    },
    async created(){
        this.payments = await getPayments()
    },
    computed: {
        computedStyle () {
            return {
                '--border-color': this.$vuetify.theme.dark ? '#fff' : 'rgba(0, 0, 0, 0.6)',
                '--logError-border': this.logError ? (this.$vuetify.theme.dark ? '#fff' : '#000') : 'none'
            }
        }
    },
    methods: {
        async refresh(){
            this.payments = await getPayments()
            this.alertType = ''
            this.alertMessage = ''
            this.newPayment = ''
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async deletePayment(id){
            const res = await deletePayment(id)
            if(res.status === 200){
                this.alertType = 'success'
                this.alertMessage = 'Delete success. Refreshing page'
            } else {
                this.alertType = 'error'
                this.alertMessage = 'Delete error. Refreshing page'
            }
            await this.sleep(2000)
            this.refresh()
        },
        async createHandler(event){
            event.preventDefault()
            let toSend = {
                name: this.newPayment
            }
            const res = await createPayment(toSend)
            if(res.status === 200){
                this.alertType = 'success'
                this.alertMessage = 'Create success. Refreshing page'
            } else {
                this.alertType = 'error'
                this.alertMessage = 'Create error. Refreshing page'
            }
            await this.sleep(2000)
            this.refresh()
        }
    }
}
</script>

<style scoped>
    .paymentForm{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .formContainer {
        margin: auto; 
        margin-top:10vh; 
        width: 40%;
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 2em;
    }
    .paymentContainer{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 80%!important;
        border-bottom: 1px solid var(--border-color);
    }
    .myFieldset{
        border: none !important;
        width: 100%!important;
    }
    .newContainer{
        width: 80%!important;
    }
    @media screen and (max-width: 992px){
        .formContainer {
            width: 80%!important;
        }
        .paymentContainer,
        .newContainer{
            width: 100%!important;
        }
    }
</style>