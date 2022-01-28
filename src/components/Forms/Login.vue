<template>
    <v-container fluid justify-center class="formContainer" :style="computedStyle">
        <form>
            <fieldset class="myFieldset">
                <legend class="myLegend"> Login</legend>

                <div class="errorContainer" v-if="logError">
                    <span>{{ logError && 'Login Failed: '}}</span>
                    <span>{{logError}}</span>
                </div>
                <v-text-field
                    v-model="username"
                    :error-messages="usernameErrors"
                    label="Username"
                    required
                    autofocus
                    v-on:keyup.enter="loginHandler"
                    prepend-icon="mdi-account-circle">
                </v-text-field>
                <v-text-field
                    v-model="password"
                    label="Password"
                    id="password"
                    :error-messages="passwordErrors"
                    required
                    :type="showpassword ? 'text' : 'password'" 
                    v-on:keyup.enter="loginHandler"
                    v-on:keyup="capsLockHandler"
                    prepend-icon="mdi-lock"
                    :append-icon="showpassword ? 'mdi-eye': 'mdi-eye-off'"
                    @click:append="showpassword = !showpassword">
                </v-text-field>
                <v-switch
                    v-model="remember"
                    v-on:keyup.enter="loginHandler"
                    flat
                    label="Remember me"
                ></v-switch>
                <div class="capsLock-message">Caps lock is on</div>
                <v-btn class="mr-4 mb-4 success" @click="loginHandler">
                    <label >Login</label>
                </v-btn>
                <v-btn class="mr-4 mb-4 error" @click="clear">
                    <label>Clear</label>
                </v-btn>
            </fieldset>
        </form>
    </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { login } from '../../utility/axios'
import { setLocalToken, setSessionToken } from '../../utility/auth'

export default {
    name: 'Login',
    mixins: [validationMixin],
    validations: {
      username: { required },
      password: { required },
    },
    computed: {
        computedStyle () {
            return {
                '--border-color': this.$vuetify.theme.dark ? '#fff' : 'rgba(0, 0, 0, 0.6)',
                '--logError-border': this.logError ? (this.$vuetify.theme.dark ? '#fff' : '#000') : 'none'
            }
        },
        usernameErrors () {
            const errors = []
            if (!this.$v.username.$dirty){
                return errors
            }
            !this.$v.username.required && errors.push('Username is required.')
            return errors
        },
        passwordErrors () {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.required && errors.push('Password is required.')
            return errors
        },
    },
    data () {
        return{ 
            username: '',
            password: '',
            logError: '',
            showpassword: false,
            remember: true,
        }
    },
    methods: {
        async loginHandler (event) {
            event.preventDefault()
            this.$v.$touch()
            if (!this.$v.$invalid) {
                const loginResponse = await login(this.username, this.password)
                if(loginResponse.accessToken){
                    this.remember ? setLocalToken(loginResponse.accessToken) : setSessionToken(loginResponse.accessToken)
                    this.$emit('userLogged')
                    this.$router.push({path: '/'})
                }
                else {
                    this.logError = loginResponse.error
                }
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
        clear () {
            this.username = this.password = this.logError = ''
        }
    }
}
</script>

<style scoped>
.myLegend{
        text-align: center!important;
    }
.myFieldset{
    border: none !important;
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

.errorContainer{
    text-align: center;
    border: 2px solid var(--logError-border);
    padding: 1em 0.5em;
    border-radius: 20px;
    font-size: 1em;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
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
    .errorContainer{
        flex-direction: column;
    }
}
</style>