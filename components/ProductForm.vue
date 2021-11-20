<template>
    <v-card 
    color="transparent"
    :loading="loading"
    class="pa-3 d-flex flex-column mx-auto" tile flat>
        <span class="text-h5 mb-12">{{
            id ? "Edit Product" : "New Product"
        }}</span>
        <v-form 
        class="d-flex flex-column mx-auto">
            <v-card class="d-flex flex-column pa-5 mb-8" outlined tile>
            <span class="mr-6 mb-2 subtitle-2" style="min-width: 50%">Product Name</span>
            <div class="mb-8 d-flex flex-column">
                <v-text-field
                    v-model="name"
                    outlined
                    hide-details
                ></v-text-field>
                <v-expand-transition>
                    <div
                        v-if="name"
                        class="caption d-flex align-center font-weight-bold"
                    >
                        <v-icon color="black" small class="mr-1"
                            >mdi-link</v-icon
                        >
                        <span class="text--darken-2">{{
                            slug
                        }}</span>
                    </div>
                </v-expand-transition>
            </div>
                    </v-card>

            <v-card class="d-flex flex-column pa-5 mb-8" outlined tile>
                <div class="d-flex align-center mb-8" >
                    <span class="mr-6 subtitle-2" style="min-width: 50%">Price:</span>
                    <v-card outlined style="width: 50%" class="d-flex justify-space-between">
                        <v-btn
                            tile
                            @click="incrementPrice(-1)"
                            depressed
                            large
                            color="white"
                            :ripple="false"
                            class="mr-1"
                            ><v-icon>mdi-minus</v-icon></v-btn
                        >
                        <v-sheet
                        @click="editPrice=true"
                        class="d-flex align-center justify-center px-6 mr-1"
                        >
                            <span class="font-weight-bold mr-3">Tzs</span>
                            <span v-if="!editPrice" >{{
                                makeNumberCommaSeparated(price)
                            }}</span>

                            <v-text-field
                                autofocus
                                hide-details
                                v-else
                                width="20px"
                                flat
                                solo
                                dense
                                @blur="editPrice=false"
                                type="number"
                                v-model="price"
                            ></v-text-field>
                            </v-sheet
                        >
                        <v-btn
                            tile
                            @click="incrementPrice(1)"
                            depressed
                            large
                            color="white"
                            :ripple="false"
                            class=""
                            ><v-icon>mdi-plus</v-icon></v-btn
                        >
                    </v-card>
                </div>

            <div class="d-flex align-center mb-8" >
                <span class="mr-6 subtitle-2" style="min-width: 50%">Stock Amount:</span>
                <v-card outlined style="width: 50%" class="d-flex justify-space-between">
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
                    @click="editStockAmount=true"
                    class="d-flex align-center justify-center px-6 mr-1"
                    >
                        <span v-if="!editStockAmount" >{{
                            quantityToSell.toString().padStart("0", 2)
                        }}</span>

                        <v-text-field
                            autofocus
                            hide-details
                            v-else
                            width="20px"
                            flat
                            solo
                            dense
                            @blur="editStockAmount=false"
                            type="number"
                            v-model="quantityToSell"
                        ></v-text-field>
                        </v-sheet
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

            </v-card>
            <v-card outlined tile class="pa-5 d-flex flex-column justify-center mb-8">
                <div class="mb-3">
                    <span class="subtitle-2">Colors</span>
                </div>
                    <div class="d-flex flex-wrap">
                    <v-checkbox 
                    v-for="color in colors"
                    :key="color"
                    :label="color"
                    :value="color"
                    hide-details
                    dense
                    class="mr-3 mb-3" 
                    v-model="chosenColors"
                    style="min-width: 200px"
                    >
                        <template v-slot:label>
                            <div class="d-flex align-center">
                                <v-sheet 
                                :color="color"
                                width="20"
                                height="20"
                                class="rounded mr-1 outlined">
                                </v-sheet>
                                <span>{{ color }}</span>
                            </div>
                        </template>
                    </v-checkbox>
                    </div>
            </v-card>

            <v-card outlined tile class=" pa-5 d-flex flex-column mb-8">
                <span class="mr-6 subtitle-2 mb-3" style="min-width: 50%">Category</span>
                <v-select
                :items="$store.state.categories"
                v-model="category"
                hide-details
                outlined
                placeholder="Choose a category"
                item-value="id"
                item-text="id"
                >
                    <template v-slot:selection="{ item }">
                        {{ item.name }}
                    </template>

                    <template v-slot:item="{ item }">
                        <span class="mr-3">{{ item.id.toString().padStart(3, '0') }}</span>
                        <span 
                        :class="item.parent ? 'ml-4': ''"
                        >{{ item.name }}</span>
                    </template>
                </v-select>
            </v-card>

            <v-card outlined tile class=" pa-5 d-flex flex-column mb-8">
                <span class="mr-6 subtitle-2 mb-3" style="min-width: 50%">Description</span>
                <v-textarea
                hide-details
                v-model="description"
                outlined
                >
                </v-textarea>
            </v-card>

            <ProductImageUpload 
            @change="imagesChange"
            />

            <div class="d-flex justify-end mb-8">
                    <v-btn 
                    x-large
                    text 
                    color="primary" 
                    class="mr-3"
                    >
                        <span class="mr-3">Save as draft</span>
                        <v-icon left>mdi-floppy</v-icon>
                    </v-btn>
                    
                    <v-btn 
                    x-large 
                    depressed 
                    @click="submit('save')"
                    class="white--text custom-primary">
                        <span class="mr-3">Publish</span>
                        <v-icon left>mdi-send</v-icon>
                    </v-btn>
            </div>
        </v-form>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            name: "Penis Enlargement Essential Oil Increase Growth Extension Sex Delay Cream For Men Pene No Side Effect Penis Extender Permanent",
            quantityToSell: 12,
            price: 1000000,
            loading: false,
            chosenColors: [],
            category: null,
            images: [],
            editStockAmount: false,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            editPrice: false,
            colors: [
                "white",
                "black",
                "grey",
                "green",
                "yellow",
                "brown",
                "purple",
                "red",
                "blue",
                "pink",
            ]
        };
    },

    

    methods: {
        imagesChange(event) {
            console.log(event)
            this.images = event;
        },
        makeNumberCommaSeparated(value) {
          return value
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      },
        increment(amount) {
            if (parseInt(this.price) + amount >= 0) {
                this.quantityToSell = parseInt(this.quantityToSell) + amount;
            }
        },
        incrementPrice(amount) {
            if (parseInt(this.price) + amount >= 0) {
                this.price = parseInt(this.price) + amount;
            }
        },
        submit(status){
            let ref = this.$fire.firestore.collection('products').doc(this.slug);
            this.loading = true;
            let data = {
                status,
                id: ref.id,
                name: this.name,
                stockAmount: this.quantityToSell,
                images: this.images,
                colors: this.chosenColors,
                description: this.description,
                slug: this.slug,
                creationTime: new Date(),
                wishes: 0,
                price: this.price,
                category: this.$store.state.categories[parseInt(this.category)],
            }

            return ref.set(data, { merge: true }).catch(console.error).then(() => {
                this.loading = false;
                this.$toast.success('Success!')
                this.$router.push(`/products/${this.slug}`)
                return this.$fire.firestore.collection('business').doc('business').set({
                    productsCount: this.$fireModule.firestore.FieldValue.increment(1)
                }, { merge: true }).then(() => {
                    return this.$fire.firestore.collection('products').doc(this.id)
                });    
            })
        
        }
    },

    computed: {
        id() {
            return this.$route.params.id;
        },
        slug() {
            return this.name.toLowerCase().slice(0,90).split(" ").join("-") + `.${(this.$store.state.business.productsCount+1).toString().padStart(4,"0")}`
        }
    },
};
</script>

<style>
</style>