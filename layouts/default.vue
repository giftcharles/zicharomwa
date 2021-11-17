<template>
  <v-app app>
    <v-app-bar
    color="transparent"
    app
    flat
    fixed
    >
      <Logo :style="$vuetify.breakpoint.mdAndUp ? 'max-width: 200px' : 'max-width: 150px'" />
    </v-app-bar>
    <v-main class="pt-0">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'
import '~/assets/fonts.css'

export default {
  data () {
    return {}
  }
}
</script>

<style>
html, body, .v-application {
  font-family: "poppins" !important;
}

.custom-primary {
  background: rgb(227,212,74);
  background: -moz-linear-gradient(90deg, rgba(227,212,74,1) 0%, rgba(255,0,178,1) 100%);
  background: -webkit-linear-gradient(90deg, rgba(227,212,74,1) 0%, rgba(255,0,178,1) 100%);
  background: linear-gradient(90deg, rgba(227,212,74,1) 0%, rgba(255,0,178,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#e3d44a",endColorstr="#ff00b2",GradientType=1);
}
</style>