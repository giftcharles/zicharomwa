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
                ><v-icon color="primary" left>mdi-heart</v-icon> Wishlist
                (0)</v-btn
            >

            <v-menu v-if="$store.state.user" offset-y>
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
                    <v-list-item>
                        <v-list-item-title @click="logOut" link
                            >Log Out</v-list-item-title
                        >
                    </v-list-item>
                </v-list>
            </v-menu>

            <div v-else>
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
            >
                <v-icon left>mdi-magnify</v-icon>
                Search
            </v-btn>

            <v-badge
                v-if="!showSearch"
                bordered
                color="error"
                icon="mdi-lock"
                class="mr-1"
                content="9+"
            >
                <v-icon color="error">mdi-cart</v-icon>
            </v-badge>

            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                        <span v-if="!showSearch" class="mr-3">|</span>
                        <span v-if="!showSearch" class="subtitle-2"
                            >90,000</span
                        >
                    </div>
                </template>
                <div class="d-flex flex-column">
                    
                </div>
            </v-menu>
        </v-app-bar>
        <v-main class="pt-0" style="min-height: 100vh">
            <v-slide-x-transition duration="100" mode="out-in">
                <Nuxt />
            </v-slide-x-transition>
        </v-main>
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

    methods: {
        logOut() {
            this.$fire.auth.signOut();
            this.$store.dispatch("logout");
            this.$router.push("/auth?t=login");
        },
        onAppBarIntersect(entries, observer) {
            this.debounce(this.appBarInsterectionAction(entries));
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

.v-input__slot::before {
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
</style>