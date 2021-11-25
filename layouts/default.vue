<template>
    <v-app app>
        <v-toolbar dense flat>
            <span>Welcome to our store!</span>
            <v-spacer></v-spacer>
            <span class="body-2 mr-5" text
                ><v-icon color="green darken-2">mdi-whatsapp</v-icon>+255
                755738219</span
            >
            <span class="body-2 mr-3" text
                ><v-icon>mdi-email</v-icon>
                <span class="text-lowercase">someemail@gmail.com</span></span
            >
            <v-btn text class="text-lowercase mr-2"
                ><v-icon left>mdi-heart</v-icon> Wishlist (0)</v-btn
            >

            <v-menu v-show="$store.state.currentUser" offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-chip v-bind="attrs" v-on="on" pill>
                        <span v-if="$store.state.profile">
                            {{ $store.state.profile.firstName }}
                            {{ $store.state.profile.lastName }}
                        </span>
                        <v-avatar right>
                            <!-- <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img> -->
                            <v-icon>mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-chip>
                </template>
                <v-list>
                    <v-list-item link to="/admin">
                        Admin
                    </v-list-item>

                    <v-list-item link>
                        <v-list-item-title @click="logOut" link
                            >Log Out</v-list-item-title
                        >
                    </v-list-item>
                </v-list>
            </v-menu>

            <div v-show="!$store.state.currentUser">
                <nuxt-link to="/auth?t=signup">
                    <span class="subtitle-2"> Register </span>
                </nuxt-link>
                <span class="mx-1">|</span>
                <nuxt-link to="/auth?t=login">
                    <span class="subtitle-2">Login</span>
                </nuxt-link>
            </div>
        </v-toolbar>
        <v-divider></v-divider>
        <div v-intersect="onAppBarIntersect"></div>
        <div v-if="!isAppIntersecting" style="height: 56px"></div>
        <v-app-bar flat :app="!isAppIntersecting" color="white">
            <nuxt-link to="/">
                <LogoLarge
                    v-if="isAppIntersecting && !showSearch"
                    class="mr-3"
                    :style="
                        $vuetify.breakpoint.mdAndUp
                            ? 'max-width: 180px'
                            : 'max-width: 160px'
                    "
                />

                <LogoSmall
                    v-else
                    class="mr-3"
                    :style="
                        $vuetify.breakpoint.mdAndUp && !showSearch
                            ? 'max-width: 50px'
                            : 'max-width: 30px'
                    "
                />
            </nuxt-link>

            <v-slide-x-reverse-transition
                style="width: 100%"
                duration="100"
                mode="out-in"
            >
                <v-combobox
                    v-model="search"
                    hide-details
                    full-width
                    v-if="showSearch"
                    @blur="showSearch = false"
                    autofocus
                    clearable
                    filled
                    class="rounded"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Type in a product or category name"
                    item-value="firestoreID"
                    item-text="firestoreID"
                >
                    <template v-slot:item="{}">
                        <div class="d-flex">
                            <span>{{}}</span>
                        </div>
                    </template>
                    <template v-slot:selection="{}">
                        <span>{{}}</span>
                    </template>
                </v-combobox>
            </v-slide-x-reverse-transition>

            <v-spacer v-if="!showSearch"></v-spacer>

            <v-btn
                color="custom-primary white--text"
                x-large
                depressed
                class="ml-1"
                v-if="showSearch"
                >Search</v-btn
            >

            <v-btn
                text
                v-if="!showSearch"
                @click="showSearch = !showSearch"
                large
                class="mr-1"
            >
                <v-icon left>mdi-magnify</v-icon>
                Search
            </v-btn>

            <v-menu v-if="!showSearch" offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                        <v-badge
                            v-if="
                                $store.state.profile &&
                                $store.state.profile.cart
                            "
                            bordered
                            color="error"
                            class="mr-5"
                            :content="`${
                                $store.state.profile.cart
                                    ? $store.state.profile.cart.length
                                    : 0
                            }`"
                        >
                            <v-icon color="error">mdi-cart</v-icon>
                        </v-badge>
                        <v-icon v-else class="mr-2">mdi-cart</v-icon>
                        <span class="mr-3">|</span>
                        <span class="subtitle-2"><span class="mr-1">Tsh</span>{{
                            $store.state.profile
                                ? makeNumberCommaSeparated(
                                      $store.state.profile.cartBalance
                                  )
                                : "0.00"
                        }}</span>
                    </div>
                </template>
                <v-card width="400" color="white" class="pa-4">
                    <div class="d-flex flex-column">
                        <span class="mb-1"
                            >({{
                                $store.state.profile
                                    ? $store.state.profile.cart.length
                                    : 0
                            }}) items in the cart</span
                        >
                        <div
                            class="d-flex"
                            style="max-height: 300px; overflow: auto"
                        >
                            <v-list v-if="cart" class="py-3">
                                <v-list-item
                                    v-for="order in cart"
                                    :key="order.id"
                                    link
                                    :to="`/products/${order.product.id}`"
                                    class="d-flex mb-5 align-start py-3"
                                >
                                    <div class="mr-3">
                                        <v-img
                                            :src="order.product.images[0]"
                                            width="40"
                                        >
                                        </v-img>
                                    </div>
                                    <div class="d-flex flex-column align-start">
                                        <span class="subtitle-2 mb-2"
                                            >{{
                                                order.product.name.slice(0, 50)
                                            }}...</span
                                        >

                                        <div
                                            style="width: 100%"
                                            class="
                                                d-flex
                                                justify-center
                                                align-center
                                                caption
                                            "
                                        >
                                            <span
                                                >Tsh
                                                {{
                                                    makeNumberCommaSeparated(
                                                        order.product.price *
                                                            order.quantity
                                                    )
                                                }}</span
                                            >
                                            <span class="ml-auto"
                                                >{{
                                                    order.quantity
                                                }}
                                                items</span
                                            >
                                        </div>
                                    </div>
                                    <div>
                                        <v-btn color="error" icon
                                            ><v-icon>mdi-close</v-icon></v-btn
                                        >
                                    </div>
                                </v-list-item>
                            </v-list>

                            <v-progress-circular
                                v-intersect.quiet="bindCart"
                                v-else
                                class="mx-auto mb-4 mt-1"
                                color="primary"
                                indeterminate
                            ></v-progress-circular>
                        </div>
                        <div class="d-flex flex-column mt-5 mb-3">
                            <div class="d-flex justify-space-between mb-3">
                                <span>Sub Total:</span>
                                <span class="subtitle-2"><span class="mr-1">Tsh</span>{{
                                    $store.state.profile
                                        ? makeNumberCommaSeparated(
                                            $store.state.profile.cartBalance
                                        )
                                        : "0.00"
                                }}</span>
                            </div>
                            <div class="d-flex justify-space-between mb-3">
                                <span>Total:</span>
                                <span class="subtitle-2"><span class="mr-1">Tsh</span>{{
                                    $store.state.profile
                                        ? makeNumberCommaSeparated(
                                            $store.state.profile.cartBalance
                                        )
                                        : "0.00"
                                }}</span>
                            </div>
                            <v-btn
                                to="/cart"
                                block
                                tile
                                depressed
                                color="custom-primary white--text mb-3"
                            >
                                <v-icon left>mdi-cart</v-icon> View Cart</v-btn
                            >
                            <v-btn
                                block
                                tile
                                depressed
                                color="custom-primary white--text"
                                ><v-icon left>mdi-cash</v-icon> Check Out</v-btn
                            >
                        </div>
                    </div>
                </v-card>
            </v-menu>
        </v-app-bar>
        <v-divider v-if="$route.path.includes('admin')"></v-divider>
        <v-slide-y-transition :duration="100" mode="out-in">
            <v-toolbar v-show="$route.path.includes('admin')" dense flat>
                <div class="mx-auto" style="min-width: 1280px">
                    <span class="px-3 text--disabled">ADMIN PANEL</span>
                    <v-btn to="/admin/categories" text class="px-3 mr-1 text-capitalize">Categories</v-btn>
                    <v-btn to="/admin/products" text class="px-3 mr-1 text-capitalize">Products</v-btn>
                    <v-btn to="/admin/users" text class="px-3 mr-1 text-capitalize">Users</v-btn>
                    <v-btn to="/admin/orders" text class="px-3 mr-1 text-capitalize">Orders</v-btn>
                </div>
            </v-toolbar>
        </v-slide-y-transition>

        <v-main class="pt-0" style="min-height: 100vh">
            <v-slide-x-transition duration="100" mode="out-in">
                <Nuxt />
            </v-slide-x-transition>
        </v-main>
        <CategoryForm />
    </v-app>
</template>

<script>
import "@mdi/font/css/materialdesignicons.css";
import "~/assets/fonts.css";

export default {
    data() {
        return {
            isAppIntersecting: true,
            search: "",
            showSearch: false,
        };
    },

    mounted() {
        this.$store.dispatch("bindBusinessDoc");
        this.$store.dispatch("bindCategoriesDocs");
    },

    methods: {
        bindCart(entries, observer) {
            this.$store.dispatch("bindCart");
        },
        logOut() {
            this.$fire.auth.signOut();
            this.$store.dispatch("logout");
            this.$router.push("/auth?t=login");
        },
        onAppBarIntersect(entries, observer) {
            this.debounce(this.appBarInsterectionAction(entries));
        },
        makeNumberCommaSeparated(value) {
            return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        appBarInsterectionAction(entries) {
            return (this.isAppIntersecting = entries[0].isIntersecting);
        },
        debounce(func, timeout = 400) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        },
    },

    computed: {
        cart() {
            return this.$store.state.cart;
        },
    },
};
</script>

<style>
html,
body,
.v-application,
.theme--light.v-application {
    font-family: "poppins" !important;
    background-color: #fafafa !important;
}

form .v-input__slot::before {
    border-style: none !important;
}

a {
    text-decoration: none;
}

.custom-primary {
    background: rgb(0, 172, 186);
    background: -moz-linear-gradient(
        -90deg,
        rgba(0, 172, 186, 1) 0%,
        rgba(74, 218, 0, 1) 100%
    );
    background: -webkit-linear-gradient(
        -90deg,
        rgba(0, 172, 186, 1) 0%,
        rgba(74, 218, 0, 1) 100%
    );
    background: linear-gradient(
        -90deg,
        rgba(0, 172, 186, 1) 0%,
        rgba(74, 218, 0, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#00acba",endColorstr="#4ada00",GradientType=1);
}

.incrementer input {
    text-align: center;
}
</style>