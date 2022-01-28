<template>
  <v-app>
    <Bar :authenticated="authenticated" />
    <v-main>
      <router-view @userLogged="authenticated = true"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Bar from './components/Bar'
import { isLogged } from './utility/auth'
export default {
  name: 'App',
  components: {
    Bar
  },
  data () {
    return {
      authenticated: false
    }
  },
  async created () {
    this.authenticated = await isLogged()
  }
};
</script>