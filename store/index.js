import qrcode from "qrcode-generator";
import { Planter, TreeHugger } from "planter";
import MetaNode from "planter/lib/meta-node";
import { getRandomKeyPath } from "planter/lib/utils";
import { instance } from "bitindex-sdk";
import VuexPersistence from "vuex-persist";
import bsv from "bsv";
import bsvEcies from "bsv/ecies";
import { protocols } from "../defaults";

const bitindex = instance();
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export const state = () => ({
  xprivKey: undefined,
  username: undefined, // Only for usernode creation
  // userAddress: undefined;
  utxos: [],
  userNodeAddress: undefined,
  userNodeTx: undefined,
  messages: {},
  contacts: {}
  // qrDataURL: ""; // Some problems with string lengths?
});

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

  setUTXOs(state, utxos) {
    state.utxos = utxos;
  },

  setUserNodeTx(state, tx) {
    state.userNodeTx = tx;
  },

  updateMessages(state, messages) {
    state.messages = { ...state.messages, ...messages };
  },

  updateContacts(state, contacts) {
    state.contacts = { ...state.contacts, ...contacts };
  },

  setUserNodeAddress(state, address) {
    state.userNodeAddress = address;
  },

  resetUser(state) {
    state.messages = {};
    state.contacts = {};
    state.userNodeTx = undefined;
    state.userNodeAddress = undefined;
    state.username = undefined;
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

  async syncUTXOs({ commit, getters }) {
    const utxos = await bitindex.address.getUtxos(
      getters.wallet.fundingAddress
    );
    commit("setUTXOs", utxos);
  },

  async createUserNode({ commit, state, getters }) {
    if (!state.username) {
      throw new Error("Username not set");
    }
    const keyPath = getRandomKeyPath();
    const encryptionKey = getters.xprivKey
      .deriveChild(keyPath)
      .publicKey.toString();
    const response = await getters.wallet.createNode({
      data: [protocols.user, state.username, encryptionKey],
      keyPath: keyPath
    });
    if (!response.txid) {
      throw new Error(reponse);
    }
    commit("setUserNodeAddress", response.address);
    console.log(response);
  },

  async syncUserNode({ commit, getters, state }) {
    const find = {
      "out.s6": protocols.user
    };

    if (state.userNodeAddress) {
      find["node.a"] = state.userNodeAddress;
    }

    const response = await getters.wallet.findSingleNode(find);
    // console.log("response", response);
    if (response) {
      commit("setUserNodeTx", response.tx);
    }
  },

  // async genQRDataURL({ commit, getters }) {
  //   const typeNumber = 3;
  //   const errorCorrectionLevel = "L";
  //   const qr = qrcode(typeNumber, errorCorrectionLevel);
  //   qr.addData(getters.wallet.fundingAddress);
  //   await qr.make();
  //   const url = await qr.createDataURL(20);
  //   commit("setQRDataURL", url);
  // },

  async syncReceivedMessages({ commit, getters }, recipient) {
    const query = {
      head: true,
      "out.s6": protocols.message,
      "out.s7": getters.userNode.address
    };

    if (recipient) {
      query["parent.a"] = recipient;
    }

    const sendToMe = await TreeHugger.findAllNodes({
      find: query,
      limit: 200
    });
    if (sendToMe.length) {
      commit(
        "updateMessages",
        sendToMe.reduce((map, node) => {
          map[node.address] = node.tx;
          return map;
        }, {})
      );
    }
  },

  async syncSentMessages({ commit, getters }, recipient) {
    const query = {
      head: true,
      "out.s6": protocols.message,
      "parent.a": getters.userNode.address
    };

    if (recipient) {
      query["out.s7"] = recipient;
    }

    const sendByMe = await TreeHugger.findAllNodes({
      find: query,
      limit: 200
    });
    // console.log(sendByMe);
    if (sendByMe.length) {
      commit(
        "updateMessages",
        sendByMe.reduce((map, node) => {
          map[node.address] = node.tx;
          return map;
        }, {})
      );
    }
  },

  async syncContacts({ commit, getters, state }) {
    const contacts = await TreeHugger.findAllNodes({
      find: {
        "node.a": { $in: [...getters.contactAddresses] }
      }
    });

    if (contacts.length) {
      commit(
        "updateContacts",
        contacts.reduce((map, node) => {
          map[node.address] = node.tx;
          return map;
        }, {})
      );
    }
  }
};

export const getters = {
  xprivKey: state => {
    if (state.xprivKey) {
      return bsv.HDPrivateKey.fromString(state.xprivKey);
    }
  },

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

  userNode: state => {
    if (!state.userNodeTx) {
      return null;
    }
    return new MetaNode(state.userNodeTx);
  },

  decryptECIES: (state, getters) => {
    if (state.xprivKey && getters.userNode) {
      const keyChild = getters.xprivKey.deriveChild(getters.userNode.keyPath);
      return bsvEcies().privateKey(keyChild.privateKey);
    }
  },

  encryptECIES: (state, getters) => {
    if (state.xprivKey && getters.userNode) {
      const keyChild = getters.xprivKey.deriveChild(getters.userNode.keyPath);
      return bsvEcies().publicKey(keyChild.publicKey);
    }
  },

  sortedMessages: state => {
    return state.messages.sort((a, b) => {
      if (a.in.some(i => i.e.h === b.tx.h)) {
        return -1;
      } else if (b.in.some(i => i.e.h === a.tx.h)) {
        return 1;
      }
      return 0;
    });
  },

  messageNodes: state => {
    if (!state.messages) {
      return [];
    }
    return Object.values(state.messages).map(tx => new MetaNode(tx));
  },

  contactAddresses: (state, getters) => {
    const contacts = getters.messageNodes.reduce((contacts, message) => {
      return contacts.add(message.opReturn.s7).add(message.tx.parent.a);
    }, new Set());
    return contacts;
  },

  contactNodes: (state, getters) => {
    return Object.values(state.contacts).map(tx => new MetaNode(tx));
  },

  messagesByChat: (state, getters) => address => {
    return getters.messageNodes.filter(node => {
      return (
        (node.tx.parent.a === address &&
          node.opReturn.s7 === getters.userNode.address) ||
        (node.tx.parent.a === getters.userNode.address &&
          node.opReturn.s7 === address)
      );
    });
  }

  // username: state => {
  //   if (!state.userNode) {
  //     return undefined;
  //   }
  //   return state.userNode.opReturn.s7;
  // }
};

export const plugins = [vuexLocal.plugin];
