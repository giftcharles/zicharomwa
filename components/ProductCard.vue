<template>
    <v-hover>
        <template v-slot:default="{ hover }">
            <v-card
                max-width="18%"
                :color="hover ? 'grey lighten-4': ''"
                tile
                flat
                class="pa-3 d-flex flex-column mb-2"
            >
                <v-card height="200px" tile flat>
                    <v-img height="200px" contain :src="product.images[0]">
                        <v-fade-transition>
                            <v-overlay v-if="hover" absolute color="primary">
                                <v-btn icon depressed color="error">
                                    <v-icon>mdi-heart</v-icon>
                                </v-btn>

                                <v-btn
                                    :to="`/products/${product.id}`"
                                    icon
                                    depressed
                                >
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                            </v-overlay>
                        </v-fade-transition>
                    </v-img>
                </v-card>

                <span class="text-h6 font-weight-bold green--text mb-2"
                    >Tzs {{ makeNumberCommaSeparated(product.price) }}</span
                >

                <nuxt-link :to="`/products/${product.id}`">
                    <span class="body-2 black--text">
                        {{ product.name }}
                    </span>
                </nuxt-link>
            </v-card>
        </template>
    </v-hover>
</template>

<script>
export default {
    props: ["product"],

    methods: {
        makeNumberCommaSeparated(value) {
            return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
    },
};
</script>

<style>
</style>