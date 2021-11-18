<template>
  <v-card flat :loading="loading" :disabled="loading">
    <v-card
      color="grey lighten-4"
      @click="handleClick"
      class="d-flex rounded-lg pa-4 align-center"
      flat
    >
      <v-avatar :size="size" class="rounded-circle mr-6">
        <v-icon :size="size" v-if="profilePicLink.length == 0"
          >mdi-account-circle</v-icon
        >
        <v-img :size="size" v-else :src="profilePicLink"></v-img>
      </v-avatar>

      <div class="d-flex flex-column">
        <span class="subtitle-1"
          >Upload an image to represent your account</span
        >
        <span class="caption">Square images to tend to work better.</span>
      </div>

      <input
        @change="uploadImage"
        style="display: none"
        type="file"
        ref="file"
      />
    </v-card>
  </v-card>
</template>

<script>

export default {
  data: () => {
    return {
      profilePicLink: "",
      loading: false,
      size: 128
    };
  },

  methods: {
    async uploadImage(event) {
      this.loading = true;
      let image = event.target.files[0];
      let ext = image.name.split(".").pop();
      const sentence = [1, 2, 3, 4, 5].reduce((sentence, current) => {
        sentence += Math.random().toString(36).substring(7);
        return sentence;
      }, "");

      let uploadTask = this.$fire
        .storage
        .ref()
        .child(`images/profilePics/${sentence}.${ext}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        console.log,
        (error) => {
          console.error(error);
          this.loading = false;
          this.$toast.error("Could not upload profile picture!");
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.profilePicLink = downloadURL;
            this.$emit("uploaded", downloadURL);
            this.loading = false;
            this.$toast.success("Profile picture uploaded");
          });
        }
      );
    },
    handleClick() {
      this.$refs.file.click();
    },
  },

  computed: {},
};
</script>

<style scoped>
</style>