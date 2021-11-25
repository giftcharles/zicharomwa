<template>
  <div 
  class="mx-auto mt-3"
  style="max-width: 1200px"> 
      <v-card
      flat
      class="d-flex flex-column"
      tile
      >
        <h3 class="text-h5 mb-3 ml-4 mt-3">New products</h3>
        <div class="d-flex flex-wrap px-2">
          <ProductCard 
          v-for="(product, i) in [...products, ...products, ...products, ...products, ...products, ...products ]" 
          :key="product.id + i"
          :product=product
          class="mx-2 my-1"
          />
        </div>
      </v-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      products: []
    }
  },

  mounted() {
    this.$fire.firestore.collection('products').limit(10).onSnapshot((snap) => {
      this.products = snap.docs.map(x => x.data());
    })
  },

  computed: {

  },

  methods: {
    
  }
}
</script>
<style>
section {
  height: 100vh
}

/* .home {
  background: rgba(45,145,194,1);
  background-image: url("~/assets/images/noise1.png");
  background-image: url("~/assets/images/noise1.png"), linear-gradient(180deg, rgba(45,145,194,1) 0%, rgb(114, 208, 255) 110%);
}  */

@keyframes background {
  0%{background-position:0% 50%}
  100%{background-position:100% 50%}
}
</style>