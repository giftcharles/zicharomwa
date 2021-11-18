export const state = () => ({
    currentUser: null,
    profile: null,
})

export const mutations = {
  SET_USER(state, user) {
    state.currentUser = user 
  },

  SET_PROFILE(state, { profile }) {
    state.profile = profile 
  },
}

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

    dispatch('getProfile')
  },

  createBindings(){
    console.log();
  },

  clearData({ commit }) {
      commit('SET_USER', null)
      commit('SET_PROFILE', { profile: null })
  },

  async getProfile({ state, commit }) {
    console.log('store user', state.currentUser)
    const doc = await this.app.$fire.firestore.collection('users').doc(state.currentUser.uid).get()
    return commit('SET_PROFILE', { profile: doc.data() }) 
  },

  setProfileAction({ commit }, profile) {
    return commit('SET_PROFILE', { profile }) 
  },

  setUserAction({ commit }, user) {
    return commit('SET_USER', user) 
  },

  logout( { state, commit, dispatch }) {
    return this.app.$fire.auth.signOut().then(() => {
      dispatch('clearData')
    })
  }
}

