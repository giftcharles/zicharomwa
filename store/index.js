import { vuexfireMutations, firestoreAction } from 'vuexfire'

export const state = () => ({
    currentUser: null,
    profile: null,
    showCategoryDialog: false,
    business: {
      productsCount: 0
    },
    categories: [],
    cart: null
})

export const mutations = {
  ...vuexfireMutations,
  SET_USER(state, user) {
    state.currentUser = user 
  },

  SET_PROFILE(state, { profile }) {
    state.profile = profile 
  },

  SET_CATEGORY_DIALOG(state, { value }) {
    state.showCategoryDialog = value 
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

  bindBusinessDoc: firestoreAction(async function ({ bindFirestoreRef }) {
    const ref = this.app.$fire.firestore
      .collection('business')
      .doc('business')
    await bindFirestoreRef('business', ref, { wait: true })
  }),
  unbindBusinessDoc: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('business', false)
  }),

  bindCart: firestoreAction(async function ({ state, bindFirestoreRef }) {
    const ref = this.app.$fire.firestore
      .collection('orders')
      .where("customer.uid", "==", state.currentUser.uid)
    await bindFirestoreRef('cart', ref, { wait: true })
  }),
  unbindCart: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('cart', false)
  }),

  bindCategoriesDocs: firestoreAction(async function ({ bindFirestoreRef }) {
    const ref = this.app.$fire.firestore
      .collection('categories')
    await bindFirestoreRef('categories', ref, { wait: true })
  }),
  unbindCategoriesDocs: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('categories', false)
  }),

  bindProfileDoc: firestoreAction(async function ({ dispatch, state, bindFirestoreRef }) {
    const ref = this.app.$fire.firestore
      .collection('users')
    .doc(state.currentUser.uid)
    await bindFirestoreRef('profile', ref, { wait: true })
  }),
  unbindProfileDoc: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('profile', false)
  }),

  createBindings({ dispatch }){
     dispatch('bindBusinessDoc')
  },

  showCategoryDialogAction({ commit }, value){
    commit('SET_CATEGORY_DIALOG', { value })
  },

  clearData({ commit,dispatch }) {
      commit('SET_USER', null)
      commit('SET_PROFILE', { profile: null })
      dispatch('unbindBusinessDoc')
      dispatch('unbindBusinessDoc')
      dispatch('unbindCategoriesDocs')
  },

  async getProfile({ dispatch }) {
      dispatch('bindProfileDoc')
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

