<template>
  <v-dialog
      v-model="dialog"
      width="500"
      :loading="loading"
    >
      <v-card 
      :loading="loading"
      tile class="d-flex px-4 flex-column">
        <span class="text-h5 mb-6">New Category</span>
        
        <div class="mb-4">
            <span class="mr-6 mb-2 subtitle-2" style="min-width: 50%">Title</span>
            <v-text-field
            hide-details
            outlined
            placeholder="eg. Kitchen"
            v-model="name"
            ></v-text-field>
        </div>

        <div class="mb-4">
            <span class="mr-6 mb-2 subtitle-2" style="min-width: 50%">Parent</span>
            <v-select
                :items="categories"
                v-model="parent"
                hide-details
                outlined
                placeholder="Choose parent category"
                item-value="id"
                item-text="id"
            >
                <template v-slot:selection="{ item }">
                    {{ item.name }}
                </template>

                <template v-slot:item="{ item }">
                    {{ item.name }}
                </template>
            </v-select>
        </div>


        <div class="mb-4 d-flex justify-end">
            <v-btn 
            @click="dialog=false"
            color="error" text x-large>Cancel</v-btn>

            <v-btn 
            @click="submit"
            color="custom-primary white--text" depressed x-large>Submit</v-btn>
        </div>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            name: 'Kitchen',
            parent: null
        }
    },
    methods: {
        submit(){
            this.loading = true
            let ref = this.$fire.firestore.collection('categories').doc((this.categories.length+1).toString())

            ref.set({
                name: this.name,
                id: ref.id,
                parent: this.parent
            }, {merge: true})
            .catch(console.error)
            .then(() => {
                this.loading = false
                this.$toast.success('Success!')
                this.dialog = false
            })
        }
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        },
        dialog: {
            get(){
                return this.$store.state.showCategoryDialog
            },
            set(value) {
                this.$store.dispatch('showCategoryDialogAction', value)
            }
        }
    }
}
</script>

<style>

</style>