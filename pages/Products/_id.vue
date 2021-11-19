<template>
  <v-container style="width: 1280px" class="mx-auto d-flex flex-column">

    <div class="d-flex align-center my-4" >
        <span>Some</span>
        <v-icon color="grey">mdi-chevron-right</v-icon>
        <span>Product</span>
        <v-icon color="grey">mdi-chevron-right</v-icon>
        <span>Category</span>
        <v-icon color="grey">mdi-chevron-right</v-icon>
        <span class="primary--text">Penis Enlargement Essential Oil Increase...</span>
    </div>
    
    <div class="d-flex">
      <div class="d-flex flex-column" style="width:60%">
      
      <v-img width="100%" height="500px" class="mb-4" :src="previewImage"></v-img>
      
      <div class="d-flex justify-space-between ">
          <v-hover
              v-for="(imageLink, i) in product.images" 
              :key="i" 
          >
            <template v-slot:default="{ hover }">
              <v-img 
              :height="100" 
              :width="100" 
              class="mr-2"
              :src="imageLink"
              @click="changeImage(i)"
              >
              
                <v-fade-transition>
                <v-overlay v-if="hover || previewImageIndex == i" absolute color="primary"></v-overlay>
              </v-fade-transition>
            </v-img>
            </template>
          </v-hover>
        </div>
    </div>

    <div class="d-flex flex-column ml-4">
       <span class="subtitle-1 mb-8">Penis Enlargement Essential Oil Increase Growth Extension Sex Delay Cream For Men Pene No Side Effect Penis Extender Permanent</span>

       <span class="text-h4">Tsh 90,000</span>
        <span class="mb-8 caption grey--text"><span class="font-weight-bold black--text">{{ product.stockAmount }}</span> left in stock</span>
       <div class="d-flex align-center mb-8">
         <span class="mr-6 subtitle-2">Quantity:</span>
         <v-card outlined class="d-flex">
           <v-btn tile @click="increment(-1)" depressed large color="white" :ripple="false"  class="mr-1"><v-icon>mdi-minus</v-icon></v-btn>
            <v-sheet class="d-flex align-center justify-center px-6 mr-1">{{ quantityToSell.toString().padStart("0", 2) }}</v-sheet>
           <v-btn tile @click="increment(1)" depressed large color="white" :ripple="false" class=""><v-icon>mdi-plus</v-icon></v-btn>
         </v-card>
       </div>

       <div class="d-flex align-center mb-8">
         <span class="mr-6 subtitle-2">Color:</span>
         <div class="d-flex">
           <v-card
           v-for="color in product.colors"
           :key="color"
           outlined
           ripple
           :color="chosenColor === color ? 'custom-primary white--text' : ''"
           @click="chosenColor = color"
           class="d-flex justify-center align-center pa-2 px-5 mr-1 subtitle-2"
           >
             <span class="mr-4 ">{{ color }}</span>
             <v-icon v-show="chosenColor === color" color="white">mdi-check</v-icon>
           </v-card>
         </div>
       </div>

      <div class="d-flex align-center mb-8">
        <v-btn x-large color="custom-primary" class="white--text mr-2" depressed>Buy Now</v-btn>
        <v-btn class="mr-3" x-large outlined>
          <v-icon class="mr-3" color="black">mdi-cart</v-icon>
          <span class="black--text">Add to cart</span>
        </v-btn>
        <v-icon x-large>mdi-heart-outline</v-icon>
        <!-- <v-icon x-large color="red">mdi-heart</v-icon> -->
      </div>

      <div class="d-flex flex-column">
        <span class="subtitle-2 mb-2">Description</span>
        <span class="body-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </span>
      </div>
    </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    previewImage: "",
    previewImageIndex: 0,
    chosenColor: '',
    quantityToSell: 1,
  }),

  methods: {
    changeImage(index) {
      this.previewImage = this.product.images[index];
      this.previewImageIndex = index;
    },
    increment(amount) {
      if(this.quantityToSell+amount <= this.product.stockAmount
      && this.quantityToSell+amount >= 0
      ) {
        this.quantityToSell = this.quantityToSell+amount;
      }
    }
  },

  mounted() {
    this.previewImage = this.product.images[0]
  },

  computed: {
    id() {
      return this.$route.params.id
    },
    product() {
      return {
        stockAmount: 10,
        images: [
          `https://picsum.photos/${400}`,
          `https://picsum.photos/${300}/300`,
          `https://picsum.photos/${200}`,
          `https://picsum.photos/${300}`,
          `https://picsum.photos/${200}/300`,
          `https://picsum.photos/${400}`,
        ],
        colors: ['Red', 'Purple', 'Green']
      }
    }
  }
}
</script>

<style>

</style>