<template>
    <v-card
        flat
        style="width: 1280px"
        tile
        class="pa-3 mx-auto d-flex flex-column mt-3"
    >
        <div class="d-flex align-center my-4">
            <span>Home</span>
            <v-icon color="grey">mdi-chevron-right</v-icon>
            <span>Cart</span>
        </div>

        <v-card tile outlined class="pa-4">
            <v-data-table :headers="headers" :items="cart" hide-default-footer>
                <template v-slot:item.images="{ item }">
                    <v-img
                        class="my-3"
                        width="100"
                        :src="item.product.images[0]"
                    ></v-img>
                </template>

                <template v-slot:item.name="{ item }">
                    <div style="max-width: 300px">
                        <span class="text--left">{{ item.product.name }}</span>
                    </div>
                </template>

                <template v-slot:item.quantity="{ item }">
                    <v-card
                        style="max-width: 300px"
                        outlined
                        class="d-flex justify-space-between"
                    >
                        <v-btn
                            tile
                            @click="increment(item, -1)"
                            depressed
                            large
                            color="white"
                            :ripple="false"
                            class="mr-1"
                        >
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>

                        <v-sheet
                            class="d-flex align-center justify-center px-6 mr-1"
                        >
                            <v-text-field
                                autofocus
                                hide-details
                                width="20px"
                                flat
                                solo
                                dense
                                type="number"
                                :value="item.quantity"
                                @change="
                                    (event) => {
                                        updateQuantity(item, event);
                                    }
                                "
                            ></v-text-field>
                        </v-sheet>

                        <v-btn
                            tile
                            @click="increment(item, 1)"
                            depressed
                            large
                            color="white"
                            :ripple="false"
                            class=""
                            ><v-icon>mdi-plus</v-icon></v-btn
                        >
                    </v-card>
                </template>

                <template v-slot:item.price="{ item }">
                    <span>{{
                        makeNumberCommaSeparated(item.product.price)
                    }}</span>
                </template>

                <template v-slot:item.total="{ item }">
                    <span>{{
                        makeNumberCommaSeparated(
                            item.product.price * item.quantity
                        )
                    }}</span>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="d-flex justify-center">
                        <v-btn 
                        @click="remove(item)"
                        color="error" icon
                            ><v-icon>mdi-delete</v-icon></v-btn
                        >
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <div class="d-flex justify-space-between mt-12">
            <v-card
                max-width="400px"
                min-width="50%"
                tile
                outlined
                class="d-flex pa-4 flex-column"
            >
                <div class="d-flex justify-space-between mb-3">
                    <span class="mr-5">Sub Total</span>
                    <span
                        ><span class="mr-1">Tsh</span
                        >{{
                            $store.state.profile
                                ? makeNumberCommaSeparated(
                                      $store.state.profile.cartBalance
                                  )
                                : "0.00"
                        }}</span
                    >
                </div>
                <div class="d-flex justify-space-between mb-3">
                    <span class="mr-5">Total</span>
                    <span
                        ><span class="mr-1">Tsh</span
                        >{{
                            $store.state.profile
                                ? makeNumberCommaSeparated(
                                      $store.state.profile.cartBalance
                                  )
                                : "0.00"
                        }}</span
                    >
                </div>
            </v-card>

            <div class="mt-auto">
                <v-btn
                    depressed
                    class="white--text"
                    x-large
                    color="custom-primary"
                    ><v-icon left>mdi-cash</v-icon> Check Out</v-btn
                >
            </div>
        </div>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            headers: [
                { text: "Image", align: "center", value: "images" },
                { text: "Product", align: "", value: "name" },
                { text: "Price", align: "center", value: "price" },
                { text: "Quantity", align: "center", value: "quantity" },
                { text: "Total", align: "center", value: "total" },
                { text: "Actions", align: "center", value: "actions" },
            ],
        };
    },

    methods: {
        remove(order) {
            this.$fire.firestore
                .collection("orders")
                .doc(order.id)
                .delete()
                .catch(console.error)
                .then(() => {
                    this.updateUserCart();
                    this.$toast.clear();
                    this.$toast.success("success");
                });
        },
        updateQuantity(order, event) {
            let amount = parseInt(event);
            if (amount > 0 && amount <= order.product.stockAmount) {
                // this.setQuantityForAnOrder(order, this.$fireModule.firestore.FieldValue.increment(amount))
                this.setQuantityForAnOrder(order, amount);
            }
        },
        setQuantityForAnOrder(order, quantity) {
            this.$fire.firestore
                .collection("orders")
                .doc(order.id)
                .set(
                    {
                        quantity,
                    },
                    { merge: true }
                )
                .catch(console.error)
                .then(() => {
                    this.updateUserCart();
                    this.$toast.clear();
                    this.$toast.success("success");
                });
        },
        makeNumberCommaSeparated(value) {
            return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        increment(order, amount) {
            amount = amount + order.quantity;
            if (amount > 0 && amount <= order.product.stockAmount) {
                this.setQuantityForAnOrder(order, amount);
            }
        },
        updateUserCart() {
            let cartBalance = this.cart.reduce(
                (prev, curr) => curr.quantity * curr.product.price + prev,
                0
            );
            console.log(cartBalance);
            this.$fire.firestore
                .collection("users")
                .doc(this.$store.state.profile.uid)
                .set(
                    {
                        cartBalance,
                        cart: this.cart.map(x => x.product.id)
                    },
                    { merge: true }
                )
                .catch(console.error)
                .then(console.log);
        },
    },

    mounted() {
        this.$store.dispatch("bindCart");
    },

    computed: {
        cart() {
            return this.$store.state.cart || [];
        },
    },
};
</script>

<style>
</style>