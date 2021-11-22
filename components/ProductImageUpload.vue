<template>
    <v-card
        outlined
        tile
        class="pa-5 mb-6 d-flex flex-column"
    >
        <div class="d-flex justify-space-between align-center mb-5">
            <span class="mr-6 mb-2 subtitle-2" style="min-width: 50%"
                >Upload images of the product</span
            >
            <v-btn
                @click="openPicker"
                color="custom-primary white--text"
                depressed
            >
                <v-icon left>mdi-upload</v-icon>
                <span>Upload images</span>
            </v-btn>
        </div>

        <input
            style="display: none"
            type="file"
            ref="input"
            @change="uploadImage"
            multiple
        />

        <div class="d-flex flex-wrap mb-5">
            <div
            v-for="image in images"
            :key="image"
            class="mr-3 mb-3"
            >
                <v-hover>
                    <template v-slot:default="{ hover }">
                        <v-img
                        :width="250"
                        :max-width="250"
                        :src="image"
                        >
                            <v-fade-transition>
                                <v-overlay
                                    v-if="hover"
                                    absolute
                                    @click="removeImage(image)"
                                    color="primary"
                                >
                                    <v-btn depressed>
                                        <v-icon left>mdi-close</v-icon>
                                        Remove
                                    </v-btn>
                                </v-overlay>
                            </v-fade-transition>
                        </v-img>

                    </template>
                </v-hover>
            </div>
            <v-progress-circular v-if="loading.length > 0" indeterminate></v-progress-circular>
        </div>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            images: [],
            loading: [],
        };
    },
    props: ['currentImages'],
    watch: {
        currentImages(v) {
            if(v && v.length > 0) {
                this.images = v
            }
        }
    },
    methods: {
        removeImage(image) {
            this.images = this.images.filter((img) => image !== img)
            this.$emit("change", this.images);
        },
        openPicker() {
            this.$refs.input.click();
        },
        async uploadImage(event) {
            let images = event.target.files;
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                const loadingIndex = this.images.length + index;
                this.loading.push(loadingIndex)

                let ext = image.name.split(".").pop();
                const sentence = [1, 2, 3, 4, 5].reduce((sentence, current) => {
                    sentence += Math.random().toString(36).substring(7);
                    return sentence;
                }, "");

                let uploadTask = this.$fire.storage
                    .ref()
                    .child(`images/products/${sentence}.${ext}`)
                    .put(image);

                uploadTask.on(
                    "state_changed",
                    console.log,
                    (error) => {
                        console.error(error);
                        this.$toast.error("Could not upload image!");
                    },
                    () => {
                        uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then((downloadURL) => {
                                this.images.push(downloadURL);
                                this.loading = this.loading.filter((i) => i !== loadingIndex)
                                this.$emit("change", this.images);
                                this.$toast.success("Image uploaded!");
                            });
                    }
                );
            }
        },
    },
};
</script>

<style>
</style>