<template>
  <v-container fluid justify-center class="formContainer" :style="computedStyle">
        <form>
            <fieldset class="myFieldset">
                <legend class="myLegend">
                    Modify your data
                </legend>
                <v-alert v-if="alertMessage" dense :type="alertType">{{alertMessage}}</v-alert>
                <v-container class="avatarContainer">
                    <img :src="pathImage" :alt="`Profile picture of ${personalInfo.username}`">
                </v-container>
                <v-text-field
                    v-model="personalInfo.name"
                    label="Name"
                    autofocus
                    prepend-icon="mdi-account-circle"
                    v-on:keyup.enter="modifyHandler">
                </v-text-field>
                <v-text-field
                    v-model="personalInfo.surname"
                    label="Surname"
                    prepend-icon="mdi-account-circle"
                    v-on:keyup.enter="modifyHandler">
                </v-text-field>
                <v-text-field
                    v-model="personalInfo.username"
                    label="Username"
                    prepend-icon="mdi-account-circle"
                    v-on:keyup.enter="modifyHandler">
                </v-text-field>
                <v-text-field
                    v-model="password"
                    label="Password"
                    id="password"
                    :type="showpassword ? 'text' : 'password'" 
                    v-on:keyup.enter="modifyHandler"
                    prepend-icon="mdi-lock"
                    :append-icon="showpassword ? 'mdi-eye': 'mdi-eye-off'"
                    @click:append="showpassword = !showpassword">
                </v-text-field>
                <v-file-input 
                    v-model="avatar" 
                    label="Select Avatar Image" 
                    accept="image/*"
                ></v-file-input>
                <v-btn class="mr-4 mb-4 success" @click="modifyHandler">
                    <label >Modify</label>
                </v-btn>
                <v-btn class="mr-4 mb-4 error" @click="undo">
                    <label>Undo</label>
                </v-btn>
            </fieldset>
        </form>
    </v-container>
</template>

<script>
import { getSingleEmployee, modifyEmployeeData, getBasePathImg } from '../../utility/axios'
import { getPersonalId } from '../../utility/auth'
export default {
    name: 'ModifyData',
    data () {
        return{ 
            personalInfo: {},
            password: '',
            showpassword: false,
            avatar: null,
            alertMessage: '',
            alertType: '',
            baseImgPath: getBasePathImg() + '/img/employeesAvatar/',
            pathImage: ''
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
    async created () {
        this.id = await getPersonalId()
        const userInfo = await getSingleEmployee(this.id)
        this.pathImage = this.baseImgPath + userInfo.avatar 
        this.personalInfo = { name: userInfo.name, surname: userInfo.surname,username: userInfo.username }
    },
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async modifyHandler (event) {
            event.preventDefault()
            let toSend = new FormData()
            if (this.password) toSend.append("password", this.password)
            if (this.avatar) toSend.append("avatar", this.avatar) 
            if (this.personalInfo.username) toSend.append("username", this.personalInfo.username)
            if (this.personalInfo.name) toSend.append("name", this.personalInfo.name)
            if (this.personalInfo.surname) toSend.append("surname", this.personalInfo.surname)
            const response = await modifyEmployeeData(toSend, this.id)
            if(response.status === 200){
                this.alertType = 'success'
                this.alertMessage = 'Modify success. Redirecting to Home'
                await this.sleep(2000)
                this.$router.push({path: '/'})
            } else {
                this.alertType = 'error'
                this.alertMessage = 'Modify error. refreshing page'
                await this.sleep(2000)
                this.$router.go(0)
            }
        },
        undo () {
            this.$router.push({path: '/'})
        }
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
    @media screen and (max-width: 992px){
        .formContainer {
            width: 80%!important;
        }
        .avatarContainer{
            width: 90%!important;
        }
    }
</style>