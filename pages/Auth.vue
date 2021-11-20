<template>
  <v-main>
    <div style="max-width: 1200px" class="mx-auto py-10">
      <v-card
        height="100%"
        width="100%"
        flat
        class="d-flex"
        style="overflow: hidden"
        :loading="loading"
        :disabled="loading"
        tile
      >
        <div style="width: 30%">
          <v-img
            :src="
              require('../assets/images/nikita-katsevich-QXDJGPZTwxs-unsplash.jpg')
            "
            height="100%"
          >
          </v-img>
        </div>

        <div
          style="max-width:700px; width:100%"
          class="pa-7 d-flex flex-column justify-align-center mx-auto"
        >
          <h1 class="font-weight-light text-h5">
            {{
              routeName !== "login"
                ? routeName !== "signup"
                  ? routeName !== "forgotten"
                    ? "Change Password"
                    : "Forgotten Password"
                  : "Create A Free Account"
                : "Log In"
            }}
          </h1>

          <v-divider class="mt-4 mb-5"></v-divider>

          <div>

          </div>

          <v-form>
            <!-- <v-scroll-y-transition duration="100">
              <ProfilePicUploader
                v-if="routeName === 'signup'"
                @uploaded="uploadedProfilePic"
                class="mb-10"
              />
            </v-scroll-y-transition> -->

            <v-scroll-y-transition duration="100">
              <div v-if="routeName === 'signup'" class="d-flex">
                <div class="mr-3" style="width: 50%">
                  <v-text-field
                    name="First Name"
                    label="First Name"
                    filled
                    dense
                    v-model="firstName"
                    prepend-icon="mdi-account"
                    class="rounded-lg"
                  ></v-text-field>
                </div>

                <div style="width: 50%">
                  <v-text-field
                    name="Last Name"
                    label="Last Name"
                    filled
                    dense
                    v-model="lastName"
                    class="rounded-lg"
                  ></v-text-field>
                </div>
              </div>
            </v-scroll-y-transition>

            <div v-if="routeName === 'signup'">
              <v-text-field
                name="Username"
                :label="routeName === 'login' ? 'Username/Email' : 'User Name'"
                filled
                v-model="userName"
                dense
                prepend-icon="mdi-account-circle"
                class="rounded-lg"
              ></v-text-field>
            </div>

            <v-scroll-y-transition duration="100">
              <div v-if="['signup', 'login', 'forgotten'].includes(routeName)">
                <v-text-field
                  name="Email"
                  label="Email"
                  v-model="email"
                  filled
                  dense
                  prepend-icon="mdi-email"
                  class="rounded-lg"
                ></v-text-field>
              </div>
            </v-scroll-y-transition>

            <v-scroll-y-transition duration="100">
              <div v-if="routeName === 'signup'">
                <v-text-field
                  name="Phone"
                  label="Phone"
                  filled
                  v-model="phone"
                  dense
                  prepend-icon="mdi-phone"
                  class="rounded-lg"
                ></v-text-field>
              </div>
            </v-scroll-y-transition>

            <v-scroll-y-transition duration="100">
              <div v-if="routeName !== 'forgotten'">
                <v-text-field
                  name="password"
                  label="Password"
                  filled
                  dense
                  hide-details=""
                  v-model="password"
                  :type="showPass ? 'text' : 'password'"
                  append-icon="mdi-eye"
                  @click:append="showPass = !showPass"
                  prepend-icon="mdi-lock"
                  class="rounded-lg"
                ></v-text-field>
              </div>
            </v-scroll-y-transition>

            <div class="d-flex justify-space-between mt-10 align-center">
              <div class="caption grey--text">
                <p v-if="routeName === 'login'" class="mb-0">
                  Trouble signing in,
                  <router-link to="/auth?t=forgotten">Click</router-link> here.
                </p>
                <p
                  v-if="routeName === 'login' || routeName === 'forgotten'"
                  class="mb-0"
                >
                  If you don't already have an account,
                  <router-link to="/auth?t=signup">Sign Up</router-link> here.
                </p>
                <p v-if="routeName === 'signup'">
                  If you already have an account,
                  <router-link to="/auth?t=login">Log In</router-link> here.
                </p>
                <p v-if="routeName === 'forgotten'">
                  If you already have an account,
                  <router-link to="/auth?t=login">Log In</router-link> here.
                </p>
              </div>
              <div>
                <v-btn class="" depressed :ripple="false" large icon>
                  <v-img :width="18" class="mr-1" :src="require('../assets/images/facebook.png')"></v-img>
                </v-btn>
                <v-btn @click="googleLogin" class="mr-2" depressed :ripple="false" large text icon>
                  <v-img :width="18" class="mr-1" :src="require('../assets/images/google-logo-9827.png')"></v-img>
                </v-btn>
                <v-btn
                  depressed
                  @click="submit"
                  x-large
                  class="white--text custom-primary font-weight-regular"
                  >{{
                    routeName !== 'signup' ? 'Login' : 'Register'
                  }}</v-btn
                >
              </div>
            </div>
          </v-form>
        </div>
      </v-card>
    </div>
  </v-main>
</template>

<script>

export default {
  data: () => {
    return {
      loading: false,
      firstName: "",
      lastName: "",
      userName: "",
      phone: "",
      address: "",
      password: "Pa$$w0rd!",
      email: "lyge@mailinator.com",
      showPass: false,
      profilePicLink: "",
      error: null,
    };
  },

  methods: {
    googleLogin(){
      let provider = new this.$fireModule.auth.GoogleAuthProvider();
      this.loading = true;
      this.$fire.auth
      .signInWithPopup(provider)
      .then(async (result) => {
        await this.$store.dispatch("setUserAction", JSON.parse(JSON.stringify(result.user)));
        this.$store.dispatch("createBindings");
        if(result.additionalUserInfo.isNewUser) {
            await this.createProfile(result.user.uid);
        }
        this.$router.push("/");
        this.loading = false;
      }).catch((err) => {
        console.error(err);
        this.loading = false;
      });
    },
    uploadedProfilePic(profilePicLink) {
      this.profilePicLink = profilePicLink;
    },
    async submit() {
      this.loading = true;
      if (this.routeName === "signup") {
        await this.$fire
          .auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(async (userCredential) => {
            await this.$store.dispatch("setUserAction", JSON.parse(JSON.stringify(userCredential.user)));
            await this.createProfile((userCredential).user.uid);
            this.$store.dispatch("createBindings");
            this.$toast.success("Success");
            this.$router.push("/");
            this.loading = false;
          })
          .catch((error) => {
            this.error = error;
            var errorCode = error.code;
            this.loading = false;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      } else if (this.routeName === "login") {
        await this.$fire
          .auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(async (userCredential) => {
            await this.$store.dispatch("setUserAction", JSON.parse(JSON.stringify(userCredential.user)));
            await this.$store.dispatch("getProfile");
            this.$store.dispatch("createBindings");
            this.$router.push("/");
            this.loading = false;
          })
          .catch((error) => {
            this.error = error;
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            this.loading = false;
            this.$toast.error("could not log you in");
          });
      }

      // else if(this.routeName == 'forgotten') {

      // }

      // else if(this.routeName == 'changepass') {
      // }
    },

    createProfile(uid){
      this.loading = true;
      let ref = this.$fire.firestore.collection("users").doc(uid);

      let profile = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        address: this.address,
        userName: this.userName,
        cartBalance: 0,
        profilePicLink: this.profilePicLink,
        joinDate: new Date(),
        uid,
        role: "customer",
      };

      return ref.set(profile, { merge: true }).then(() => {
        this.loading = false;
        return this.$store.dispatch("setProfileAction", profile);
      });
    },
  },

  computed: {
    routeName() {
      return this.$route.query.t || 'signup';
    },
  },
};
</script>

<style scoped>
main {
  /* background-image: url("../../assets/triangle2.png"),
    url("../../assets/zigzag.png"); */
  background-size: 80px;
  background-position: 7% 10%, bottom 7% right 10%;
}
</style>