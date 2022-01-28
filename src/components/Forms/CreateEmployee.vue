<template>
    <v-container fluid justify-center class="formContainer" :style="computedStyle">
        <form>
            <fieldset class="myFieldset">
                <legend class="myLegend">Create a new Employee</legend>
                <v-alert v-if="alertMessage" dense :type="alertType" role="alert" aria-label="Message to notify success or error in employee's creation">{{alertMessage}}</v-alert>
                <v-text-field
                    v-model="name"
                    label="Name"
                    autofocus
                    prepend-icon="mdi-account-circle"
                    required>
                </v-text-field>
                <v-text-field
                    v-model="surname"
                    label="Surname"
                    prepend-icon="mdi-account-circle">
                </v-text-field>
                <v-text-field
                    v-model="username"
                    label="Username"
                    prepend-icon="mdi-account-circle">
                </v-text-field>
                <v-text-field
                    v-model="password"
                    label="Password"
                    id="password"
                    :type="showpassword ? 'text' : 'password'" 
                    v-on:keyup="capsLockHandler"
                    prepend-icon="mdi-lock"
                    :append-icon="showpassword ? 'mdi-eye': 'mdi-eye-off'"
                    @click:append="showpassword = !showpassword">
                </v-text-field>
                <div class="capsLock-message">Caps lock is on</div>
                <v-select
                    :items="possibleRoles"
                    v-model="role"
                    label="Role"
                    prepend-icon="mdi-lock"
                ></v-select>
                <v-file-input 
                    v-model="avatar" 
                    label="Select Avatar Image" 
                    accept="image/*"
                ></v-file-input>
                <v-btn class="mr-4 mb-4 success" @click="createHandler" :disabled="!(name && surname && username && password && role)">
                    <label>Create</label>
                </v-btn>
                <v-btn class="mr-4 mb-4 error" @click.prevent="undo">
                    <label>Undo</label>
                </v-btn>
            </fieldset>
        </form>
    </v-container>
</template>

<script>
import { createEmployee } from '../../utility/axios'
export default {
    name: 'CreateEmployee',
    data () {
        return {
            name: '',
            surname: '',
            username: '',
            password: '',
            role: '',
            avatar: null,
            alertMessage: '',
            alertType: '',
            possibleRoles: ['employee', 'admin'],
            showpassword: false,
        }
    },
    computed: {
        computedStyle () {
            return {
                '--border-color': this.$vuetify.theme.dark ? '#fff' : 'rgba(0, 0, 0, 0.6)',
                '--logError-border': this.logError ? (this.$vuetify.theme.dark ? '#fff' : '#000') : 'none'
            }
        },
    },
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        undo () {
            this.$router.push({path: '/'})
        },
        async createHandler(){
            let toSend = new FormData()
            toSend.append("name", this.name)
            toSend.append("surname", this.surname)
            toSend.append("username", this.username)
            toSend.append("password", this.password)
            toSend.append("role", this.role)
            if(this.avatar) toSend.append("avatar", this.avatar)
            const res = await createEmployee(toSend)
            if(res.status === 200){
                this.alertType = 'success'
                this.alertMessage = 'Create success. Redirecting to Home'
                await this.sleep(2000)
                this.$router.push({path: '/'})
            } else {
                this.alertType = 'error'
                this.alertMessage = 'Create error. refreshing page'
                await this.sleep(2000)
                this.$router.go(0)
            }
        },
        capsLockHandler (event) {
            if(event.getModifierState('CapsLock')){
                document.querySelector('.capsLock-message').classList.add('show')
            }
            else{
                document.querySelector('.capsLock-message').classList.remove('show')
            }
        },
    }
}
</script>

<style scoped>
    .myLegend{
        text-align: center!important;
    }
    .myFieldset{
        border: none!important;
    }
    .formContainer {
        margin: auto; 
        margin-top:10vh; 
        width: 40%;
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 2em;
    }
    .formContainer>form{
        padding: 1em;
    }
    .avatarContainer{
        width: 60%!important;
    }
    .avatarContainer>img{
        width: 100%;
    }
    .capsLock-message {
        display: none;
    }

    .capsLock-message.show{
        display: block;
        color: red;
    }
    @media screen and (max-width: 992px){
        .formContainer {
            width: 80%!important;
        }
        .avatarContainer{
            width: 90%!important;
        }
    }
</style>