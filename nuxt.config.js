import colors from 'vuetify/es5/util/colors'
import { POSITION } from "vue-toastification";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - zicharomwa',
    title: 'zicharomwa',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
    "vue-toastification/nuxt",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: process.env.NODE_ENV === 'production',
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  firestore: {
    enablePersistence: true
  },
  firebase: {
    // options
    config: {
      apiKey: "AIzaSyC2rqshNYBIrxIh-8hMksQxHhulz9jVLZY",
      authDomain: "zicharomwa-ent.firebaseapp.com",
      projectId: "zicharomwa-ent",
      storageBucket: "zicharomwa-ent.appspot.com",
      messagingSenderId: "835628224931",
      appId: "1:835628224931:web:b03eaab864354a3fb4ca16",
      measurementId: "G-QFH0783FYM"
    },
    services: {
      auth: {
        ssr: true,
        persistence: 'local', // default
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChangedAction',
          subscribeManually: false
        },
      },
      firestore: true,
      functions: true,
      storage: true,
      analytics: true,
    }
  },

  toast: {
    position: POSITION.BOTTOM_CENTER 
  },

  buildDir: 'functions/.nuxt',
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: '/assets/',
  }
}
