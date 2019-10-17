import qrcode from "qrcode-generator";
import { Planter } from "planter";
import { instance } from "bitindex-sdk";
import VuexPersistence from "vuex-persist";
import bsv from "bsv";
import { protocols } from "../defaults";

const bitindex = instance();
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export const state = () => {
  xprivKey: undefined;
  username: undefined; // Only for usernode creation
  // userAddress: undefined;
  utxos: [];
  userNode: undefined;
  // qrDataURL: ""; // Some problems with string lengths?
};

export const mutations = {
  setUserAddress(state, address) {
    state.userAddress = address;
  },

  setUsername(state, name) {
    state.username = name;
  },

  setXprivKey(state, xprivKey) {
    state.xprivKey = xprivKey;
  },

  setUTXOS(state, utxos) {
    state.utxos = utxos;
  },

  setUserNode(state, node) {
    state.userNode = node;
  }

  // setQRDataURL(state, url) {
  //   state.qrDataURL = url;
  // }
};

export const actions = {
  async genWallet({ commit }) {
    const xprivKey = bsv.HDPrivateKey.fromRandom().toString();
    // commit("setXprivKey", xprivKey);
    commit(
      "setXprivKey",
      "xprv9s21ZrQH143K2zJKULiRGhabnrAmZ68bzGh3LhivsgkW5U44meyTup6zeqc6vZa2PfM6x1KqoqVTauEA1qubAPNqsm87yAhHn4c9HTsohTb"
    );
  },

  async updateUTXOs({ commit, getters }) {
    const utxos = await bitindex.address.getUtxos(
      getters.wallet.fundingAddress
    );
    commit("setUTXOs", utxos);
  },

  async createUserNode({ state, getters }) {
    if (!state.username) {
      throw new Error("Username not set");
    }
    const response = await getters.wallet.createNode({
      data: [protocols.user, state.username]
    });
    if (!response.txid) {
      throw new Error(reponse);
    }
    console.log(response);
  },

  async syncUserNode({ commit, getters, state }) {
    const response = await getters.wallet.findSingleNode({
      "out.s6": protocols.user
    });
    console.log("response", response);
    if (response) {
      commit("setUserNode", response);
    }
  }

  // async genQRDataURL({ commit, getters }) {
  //   const typeNumber = 3;
  //   const errorCorrectionLevel = "L";
  //   const qr = qrcode(typeNumber, errorCorrectionLevel);
  //   qr.addData(getters.wallet.fundingAddress);
  //   await qr.make();
  //   const url = await qr.createDataURL(20);
  //   commit("setQRDataURL", url);
  // }
};

export const getters = {
  wallet: state => {
    return new Planter(state.xprivKey);
  },

  // qrDataURL: (state, getters) => {
  //   const typeNumber = 3;
  //   const errorCorrectionLevel = "L";
  //   const qr = qrcode(typeNumber, errorCorrectionLevel);
  //   qr.addData(getters.wallet.fundingAddress);
  //   qr.make();
  //   return qr.createDataURL(20);
  // },

  balance: state => {
    if (state.utxos) {
      return state.utxos.reduce((a, c) => a + c.satoshis, 0);
    }
    return 0;
  },

  username: state => {
    if (!state.userNode) {
      return undefined;
    }
    return state.userNode.opReturn.s7;
  }
};

export const plugins = [vuexLocal.plugin];
