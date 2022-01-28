<template>
  <v-card :to="link || ''">
    <v-container>
        <v-img :src="imgPath" width="300px" :alt="`Image of product ${product.name}`"></v-img>
    </v-container>
    <v-card-title>{{product.name}}</v-card-title>
    <v-card-subtitle>Category: {{product.category}}</v-card-subtitle>
    <v-card-text>SuperCategory: {{product.superCategory}}</v-card-text>
    <v-card-text>State: {{product.state}}</v-card-text>
    <v-card-text>Price: {{product.price}}€</v-card-text>
    <v-card-text>Id: {{product._id}}</v-card-text>
  </v-card>
</template>

<script>
import { getBasePathImg } from '../../utility/axios'
export default {
  name: 'productCard',
  props: {
      product: {
          required: true
      },
      link: {
          type: String,
      }
  },
  data () {
    return {
      imgPath: `${getBasePathImg()}/img/articlesImages/${this.product.img}`
    }
  },
}
</script>

<style scoped>
</style>