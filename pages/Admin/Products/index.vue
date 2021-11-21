<template>
    <v-card
        flat
        style="width: 1280px"
        tile
        class="pa-3 mx-auto d-flex flex-column mt-3"
    >
        <v-toolbar flat>
            <span class="text--secondary">{{ $store.state.business.productsCount }} item(s)</span>
            <v-spacer></v-spacer>
            <v-btn color="custom-primary" class="white--text" depressed
                ><v-icon color="white" left>mdi-plus</v-icon> New Product</v-btn
            >
        </v-toolbar>

        <v-data-table
            :headers="headers"
            :items="products"
            hide-actions
            :loading="loading"
        >
            <template v-slot:item.images="{ item }">
                <v-img :src="item.images[0]" width="100" class="my-3"> </v-img>
            </template>

            <template v-slot:item.description="{ item }">
                <div style="max-width: 300px">
                    <span class="body-2"
                        >{{ item.description.slice(0, 150)
                        }}{{ item.description.length > 150 ? "..." : "" }}</span
                    >
                </div>
            </template>

            <template v-slot:item.name="{ item }">
                <div style="max-width: 300px">
                    <span class="body-2">{{ item.name }}</span>
                </div>
            </template>

            <template v-slot:item.price="{ item }">
                <span class="body-2">{{
                    makeNumberCommaSeparated(item.price)
                }}</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex justify-center align-center">
                    <v-btn
                        :to="`/admin/products/${item.id}`"
                        color="primary"
                        icon
                        ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn :to="`/products/${item.id}`" icon
                        ><v-icon>mdi-eye</v-icon></v-btn
                    >
                    <v-btn color="error" icon
                        ><v-icon>mdi-delete</v-icon></v-btn
                    >
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            products: [],
            headers: [
                { text: "Image", align: "center", value: "images" },
                { text: "Product", align: "", value: "name" },
                { text: "Stock", align: "center", value: "stockAmount" },
                { text: "Price", align: "", value: "price" },
                { text: "Description", align: "", value: "description" },
                { text: "Actions", align: "center", value: "actions" },
            ],
        };
    },

    mounted() {
        this.$fire.firestore
            .collection("products")
            .limit(10)
            .onSnapshot((snap) => {
                this.products = snap.docs.map((doc) => doc.data());
            });
    },

    methods: {
        makeNumberCommaSeparated(value) {
            return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
    },

    computed: {},
};
</script>

<style>
</style>