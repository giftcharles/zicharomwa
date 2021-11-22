<template>
    <v-card
        flat
        style="width: 1280px"
        tile
        class="pa-3 mx-auto d-flex flex-column mt-3"
    >
        <v-toolbar flat>
            <span class="text--secondary mr-3">{{ $store.state.business.productsCount }} item(s)</span>
            <v-text-field
            placeholder="search"
            hide-details
            prepend-icon="mdi-magnify"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn 
            @click="categoryDialog=true"
            color="custom-primary" class="white--text" depressed
                ><v-icon color="white" left>mdi-plus</v-icon> New Category</v-btn
            >
        </v-toolbar>

        <v-data-table
            :headers="headers"
            :items="categories"
            :loading="loading"
        >
            <template v-slot:item.images="{ item }">
                <v-img v-if="item.images" :src="item.images[0]" width="100" class="my-3"> </v-img>
            </template>

            <template v-slot:item.description="{ item }">
                <div v-if="item.description" style="max-width: 300px">
                    <span class="body-2"
                        >{{ item.description.slice(0, 150)
                        }}{{ item.description.length > 150 ? "..." : "" }}</span
                    >
                </div>
            </template>

            <template v-slot:item.name="{ item }">
                <div style="max-width: 300px">
                    <span class="body-2">{{ item.id.toString().padStart(3, '0') }} {{ item.name }}</span>
                </div>
            </template>

            <template v-slot:item.parent="{ item }">
                <div style="max-width: 300px">
                    <v-select
                        :items="categories"
                        hide-details
                        outlined
                        dense
                        @change="(e) => { chooseCategoryParent(e, item) }"
                        placeholder="Choose parent category"
                        :value="categories[parseInt(item.parent)-1]"
                        item-value="id"
                        item-text="id"
                    >
                        <template v-slot:selection="{ item }">
                            {{ item.id.toString().padStart(3, '0') }} {{ item.name }}
                        </template>

                        <template v-slot:item="{ item }">
                            {{ item.id.toString().padStart(3, '0') }} {{ item.name }}
                        </template>
                    </v-select>
                </div>
            </template>


            <template v-slot:item.actions="{ item }">
                <div class="d-flex justify-center align-center">
                    <v-btn
                        color="primary"
                        icon
                        ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn color="error" icon
                        ><v-icon>mdi-delete</v-icon></v-btn
                    >
                </div>
            </template>
        </v-data-table>
        <CategoryForm />
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            headers: [
                // { text: "Image", align: "center", value: "images" },
                { text: "Category", align: "", value: "name" },
                { text: "Parent", align: "", value: "parent" },
                { text: "Description", align: "", value: "description" },
                { text: "Actions", align: "center", value: "actions" },
            ],
        };
    },

    mounted() {
        
    },

    methods: {
        chooseCategoryParent(parent, category) {
            this.$fire.firestore.collection('categories').doc(category.id)
            .set({ parent }, { merge: true }).catch(console.error)
            .then(() => {
                this.$toast.clear()
                this.$toast.success('success')
            })
        },
        makeNumberCommaSeparated(value) {
            return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
    },

    computed: {
        categoryDialog: {
            get() {
                return this.$store.state.showCategoryDialog;
            },
            set(value) {
                return this.$store.commit("SET_CATEGORY_DIALOG", { value });
            },
        },
        categories() {
            return this.$store.state.categories || []
        }
    },
};
</script>

<style>
</style>