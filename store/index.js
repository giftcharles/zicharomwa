export const state = () => ({})
export const actions = {
    async onAuthStateChangedAction({ commit, dispatch }, { authUser, claims }) {
      if (!authUser) {
        //   await dispatch('cleanupAction')
          return
      }

      // you can request additional fields if they are optional (e.g. photoURL)
      const { uid, email, emailVerified, displayName, photoURL } = authUser

      await commit('SET_USER', {
          uid,
          email,
          emailVerified,
          displayName,
          photoURL, // results in photoURL being undefined for server auth
          // use custom claims to control access (see https://firebase.google.com/docs/auth/admin/custom-claims)
          isAdmin: claims.custom_claim
      })

      dispatch('bindUserProfile', this.app.$fire.firestore)
    },
}

