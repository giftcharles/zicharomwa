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
            :loading="loading"
        >
            <template v-slot:item.images="{ item }">
                <v-img :src="item.product.images[0]" width="100" class="my-3"> </v-img>
            </template>

            <template v-slot:item.description="{ item }">
                <div style="max-width: 300px">
                    <span class="body-2"
                        >{{ item.product.description.slice(0, 150)
                        }}{{ item.product.description.length > 150 ? "..." : "" }}</span
                    >
                </div>
            </template>

            <template v-slot:item.name="{ item }">
                <div style="max-width: 300px">
                    <span class="body-2">{{ item.product.name }}</span>
                </div>
            </template>

            <template v-slot:item.customer="{ item }">
                <div class="d-flex flex-column">
                    <div class="d-flex align-center justify-space-between">
                        <v-icon small class="mr-3">mdi-account</v-icon>
                        <span class="body-2">{{ item.customer.firstName }} {{ item.customer.lastName }}</span>
                    </div>

                    <div class="d-flex align-center justify-space-between">
                        <v-icon small class="mr-3">mdi-email</v-icon>
                        <span class="body-2">{{ item.customer.email }}</span>
                    </div>

                    <div class="d-flex align-center justify-space-between">
                        <v-icon small class="mr-3">mdi-phone</v-icon>
                        <span class="body-2">{{ item.customer.phone }}</span>
                    </div>
                </div>
            </template>

            <template v-slot:item.price="{ item }">
                <span class="body-2 my-3">{{
                    makeNumberCommaSeparated((item.product.price * item.quantity))
                }}</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex justify-center align-center">
                    <v-btn icon
                        ><v-icon>mdi-eye</v-icon></v-btn
                    >
                    <v-btn 
                    @click="deleteOrder(item)"
                    color="error" icon
                        ><v-icon>mdi-close</v-icon></v-btn
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
                // { text: "Image", align: "center", value: "images" },
                { text: "Product", align: "", value: "name" },
                { text: "Price", align: "", value: "price" },
                { text: "Quantity", align: "center", value: "quantity" },
                { text: "Customer", align: "", value: "customer" },
                { text: "Actions", align: "center", value: "actions" },
            ],
        };
    },

    mounted() {
        this.$fire.firestore
            .collection("orders")
            .limit(10)
            .onSnapshot((snap) => {
                this.products = snap.docs.map((doc) => doc.data());
            });
    },

    methods: {
        deleteOrder(item) {
            return this.$fire.firestore.collection('orders')
            .doc(item.id).delete()
            .then(() => {
                this.$toast.success('success')
            })
            .catch(console.error)
        },
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