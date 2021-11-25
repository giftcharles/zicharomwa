<template>
    <v-card
        flat
        style="width: 1280px"
        tile
        class="pa-3 mx-auto d-flex flex-column mt-3"
    >
        <div v-if="id" class="d-flex align-center my-4">
            <nuxt-link to="/">
                <span>Home</span>
            </nuxt-link>
            <v-icon color="grey">mdi-chevron-right</v-icon>
            <span>{{ product.category ? product.category.name: '' }}</span>
            <v-icon color="grey">mdi-chevron-right</v-icon>
            <span 
                >{{ product.name.slice(0, 20) }}...</span
            >
        </div>

        <div v-if="id" class="d-flex">
            <div class="d-flex flex-column" style="min-width: 50%">
                <v-img
                    height="500px"
                    contain
                    class="mb-4"
                    :src="previewImage"
                ></v-img>

                <div class="d-flex">
                    <v-hover v-for="(imageLink, i) in product.images" :key="i">
                        <template v-slot:default="{ hover }">
                            <div>
                              <v-img
                              class="mr-2"
                              width="100px"
                              height="100px"
                              contain
                              :src="imageLink"
                              @click="changeImage(i)"
                            >
                                <v-fade-transition>
                                    <v-overlay
                                        v-if="hover || previewImageIndex == i"
                                        absolute
                                        color="primary"
                                    ></v-overlay>
                                </v-fade-transition>
                            </v-img>
                            </div>
                        </template>
                    </v-hover>
                </div>
            </div>

            <div class="d-flex flex-column ml-4">
                <span class="subname-1 mb-8">{{ product.name }}</span>

                <span class="text-h4" v-if="product.price">Tsh {{ makeNumberCommaSeparated( product.price ) }}</span>
                <span class="mb-8 caption grey--text"
                    ><span class="font-weight-bold black--text">{{
                        stockAmount
                    }}</span>
                    left in stock</span
                >
                <div class="d-flex align-center mb-8">
                    <span class="mr-6 subtitle-2">Quantity:</span>
                    <v-card outlined class="d-flex incrementer">
                        <v-btn
                            tile
                            @click="increment(-1)"
                            depressed
                            large
                            color="white"
                            :ripple="false"
                            class="mr-1"
                            ><v-icon>mdi-minus</v-icon></v-btn
                        >
                        <v-sheet
                            class="d-flex align-center justify-center px-6 mr-1"
                            >{{
                                quantityToSell.toString().padStart("0", 2)
                            }}</v-sheet
                        >
                        <v-btn
                            tile
                            @click="increment(1)"
                            depressed
                            large
                            color="white"
                            :ripple="false"
                            class=""
                            ><v-icon>mdi-plus</v-icon></v-btn
                        >
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
                            :color="
                                chosenColor === color
                                    ? 'custom-primary white--text'
                                    : ''
                            "
                            @click="chosenColor = color"
                            class="
                                d-flex
                                justify-center
                                align-center
                                pa-2
                                px-5
                                mr-1
                                subtitle-2
                            "
                        >
                            <span class="mr-4">{{ color }}</span>
                            <v-icon v-show="chosenColor === color" color="white"
                                >mdi-check</v-icon
                            >
                        </v-card>
                    </div>
                </div>

                <div class="d-flex align-center mb-8">
                    <v-btn
                        x-large
                        color="custom-primary"
                        class="white--text mr-2"
                        depressed
                        >Buy Now</v-btn
                    >
                    <v-btn 
                    @click="updateCart"
                    :loading="loadingCartButton" x-large outlined class="mr-1">
                        <v-icon class="mr-3" color="black">mdi-cart</v-icon>
                        <span class="black--text">{{ !inCart ? 'Add to cart' : 'Update cart' }}</span>
                    </v-btn>
                    <v-btn color="error" v-if="inCart" icon class="mr-3" @click="removeFromCart"><v-icon>mdi-close</v-icon></v-btn>
                    <v-icon class="ml-3" x-large>mdi-heart-outline</v-icon>
                    <!-- <v-icon x-large color="red">mdi-heart</v-icon> -->
                </div>

                <div class="d-flex flex-column">
                    <span class="subtitle-2 mb-2">Description</span>
                    <span class="body-1">
                        {{ product.description }}
                    </span>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        previewImage: "",
        previewImageIndex: 0,
        chosenColor: "",
        quantityToSell: 1,
        loadingCartButton: false,
        order: null,
        product: {
            stockAmount: 10,
            images: [
                `https://picsum.photos/${400}`,
                `https://picsum.photos/${300}/300`,
                `https://picsum.photos/${200}`,
                `https://picsum.photos/${300}`,
                `https://picsum.photos/${200}/300`,
                `https://picsum.photos/${400}`,
            ],
            colors: ["Silver", "Purple", "Blue"],
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            name: "Penis Enlargement Essential Oil Increase Growth Extension Sex Delay Cream For Men Pene No Side Effect Penis Extender Permanent",
        },
    }),

    methods: {
        async removeFromCart() {
            this.loadingCartButton = true

            let ref = this.$fire.firestore.collection('orders').doc(this.order.id)
            let order = Object.assign({}, this.order)
            console.log((order.product.price * order.quantity));

            return ref.delete().then(() => {
                return this.$fire.firestore.collection('users')
                .doc(this.$store.state.profile.uid).set({ 
                    cart: this.$fireModule.firestore.FieldValue.arrayRemove(this.product.id),
                    cartBalance: this.$fireModule.firestore.FieldValue.increment(-1 * (order.product.price * order.quantity)) 
                }, { merge: true })
            })
            .catch(console.error)
            .then(() => {
                this.$toast.success('success')
                this.loadingCartButton = false
            })
            .catch(() => {
                this.$toast.error('something went wrong')
                this.loadingCartButton = false
            })
        },
        async updateCart() {
            this.loadingCartButton = true
            let ref = this.inCart ? this.$fire.firestore.collection('orders').doc(this.order.id) 
            : this.$fire.firestore.collection('orders').doc() 

            let order = {
                customer: this.$store.state.profile,
                product: this.product,
                quantity: this.inCart ? this.quantityToSell + this.order.quantity : this.quantityToSell,
                time: this.inCart ? this.order.time : new Date(),
                id: ref.id,
                status: 'cart' // 'cart' | 'pending' | 'enroute' | 'delivered'
            }

            return ref.set(order, { merge: true })
            .then(() => {
                return this.$fire.firestore.collection('users')
                .doc(this.$store.state.profile.uid).set({ 
                    cart: this.$fireModule.firestore.FieldValue.arrayUnion(this.product.id),
                    cartBalance: this.$fireModule.firestore.FieldValue.increment(this.product.price * this.quantityToSell) 
                }, { merge: true })
            })
            .then(() => {
                this.$toast.success('success')
                this.loadingCartButton = false
            })
            .catch(() => {
                this.$toast.error('something went wrong')
                this.loadingCartButton = false
            })
        },
        makeNumberCommaSeparated(value) {
            return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        changeImage(index) {
            this.previewImage = this.product.images[index];
            this.previewImageIndex = index;
        },
        increment(amount) {
            if (
                this.quantityToSell + amount <= this.stockAmount &&
                this.quantityToSell + amount >= 0
            ) {
                this.quantityToSell = this.quantityToSell + amount;
            }
        },
        async getOrder() {
            console.log('getting the associated order');
            this.$fire.firestore.collection('orders')
            .where("customer.uid", "==", this.$store.state.profile.uid)
            .where("product.id", "==", this.product.id)
            .onSnapshot(snap => {
                if(snap.docs.length == 0) return;
                this.order = snap.docs[0].data();
            })
        }
    },

    mounted() {
        if(this.id) this.$fire.firestore.collection('products').doc(this.id).onSnapshot(snap => {
          this.product = snap.data()
          this.previewImage = this.product.images[0];
        })
    },

    watch: {
        inCart(v) {
            if(v) this.getOrder()
        },
        stockAmount(v){
            if(this.quantityToSell > this.stockAmount) {
                this.quantityToSell = this.stockAmount
            } 
        }
    },

    computed: {
        id() {
            return this.$route.params.id;
        },
        isFormMode() {
            return this.$route.query.t === "edit";
        },
        inCart() {
            return this.$store.state.profile 
            && this.$store.state.profile.cart
            && this.$store.state.profile.cart.includes(this.product.id)
        },
        stockAmount(){
            return this.product.stockAmount - (this.inCart ? this.order ? this.order.quantity : 0 : 0)
        }
    },
};
</script>

<style>
</style>