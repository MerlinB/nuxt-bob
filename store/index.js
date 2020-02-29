import VuexPersistence from "vuex-persist";
import bsv from "bsv";
import bsvEcies from "bsv/ecies";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export const state = () => ({});

export const mutations = {};

export const actions = {};

export const getters = {};

export const plugins = [vuexLocal.plugin];
