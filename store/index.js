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
        await dispatch('clearData')
        return
    }
    await commit('SET_USER', JSON.parse(JSON.stringify(authUser)))
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

