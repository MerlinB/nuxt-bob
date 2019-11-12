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
  utxos: [],
  userNodeAddress: undefined,
  user: undefined,
  messages: {},
  contacts: {}
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

  setUser(state, user) {
    state.user = user;
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
    state.userNodeAddress = undefined;
    state.username = undefined;
    state.user = undefined;
  }
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

  async createUser({ commit, state, getters }) {
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

  async syncUser({ commit, getters, state }) {
    const find = {
      "out.tape.cell": { $elemMatch: { s: protocols.user, i: 0 } }
    };

    if (state.userNodeAddress) {
      find["node.a"] = state.userNodeAddress;
    }

    const response = await getters.wallet.findSingleNode({ find });

    if (response) {
      commit("setUser", getters.getUser(node));
    }
  },

  async syncMessages({ commit, getters, state }, recipient) {
    if (!state.user) {
      return;
    }

    const query = {
      $or: [
        {
          "out.tape": {
            $elemMatch: {
              cell: {
                $all: [
                  { $elemMatch: { s: protocols.message, i: 0 } },
                  { $elemMatch: { s: state.user.address, i: 1 } }
                ]
              }
            }
          }
        },
        {
          "parent.a": state.user.address,
          "out.tape": {
            $elemMatch: {
              cell: {
                $all: [{ $elemMatch: { s: protocols.message, i: 0 } }]
              }
            }
          }
        }
      ]
    };

    if (recipient) {
      query.$or[0]["parent.a"] = recipient;
      query.$or[0]["out.tape"].$elemMatch.cell.$all.push({
        s: recipient,
        i: 3
      });
    }

    const response = await TreeHugger.findAllNodes({
      find: query,
      limit: 200
    });

    const currentIndex = getters.nextMempoolIndex;
    const messages = response.reduce((map, node, index) => {
      const existing = state.messages ? state.messages[node.address] : null;
      map[node.address] = {
        index: node.tx.blk
          ? node.tx.i
          : existing
          ? existing.index
          : currentIndex + index,
        confirmed: true,
        ...getters.getMessage(node)
      };
      return map;
    }, {});
    commit("updateMessages", messages);
  },

  addMessage({ commit, getters }, { address, recipient, content }) {
    commit("updateMessages", {
      [address]: {
        index: getters.nextMempoolIndex,
        block: null,
        confirmed: false,
        sender: getters.userNode.address,
        recipient,
        content
      }
    });
  },

  async sendMessage({ commit, getters }, { message, recipient }) {},

  async syncContacts({ commit, getters, state }, addresses) {
    const response = await TreeHugger.findAllNodes({
      find: {
        "node.a": { $in: addresses ? addresses : [...getters.contactAddresses] }
      }
    });

    const contacts = response.reduce((map, node, index) => {
      map[node.address] = getters.getUser(node);
      return map;
    }, {});

    commit("updateContacts", contacts);
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

  balance: state => {
    if (state.utxos) {
      return state.utxos.reduce((a, c) => a + c.satoshis, 0);
    }
    return 0;
  },

  userNode: state => {
    if (!state.user) {
      return null;
    }
    return new MetaNode(state.user.tx);
  },

  decryptECIES: (state, getters) => {
    if (state.xprivKey && state.user) {
      const keyChild = getters.xprivKey.deriveChild(state.user.keyPath);
      return bsvEcies().privateKey(keyChild.privateKey);
    }
  },

  encryptECIES: (state, getters) => {
    if (state.xprivKey && state.user) {
      const keyChild = getters.xprivKey.deriveChild(state.user.keyPath);
      return bsvEcies().publicKey(keyChild.publicKey);
    }
  },

  contactAddresses: (state, getters) => {
    const contacts = getters.sortedMessages.reduce((set, message) => {
      return set.add(message.recipient).add(message.sender);
    }, new Set());
    return contacts.add(state.user.address);
  },

  messagesByChat: (state, getters) => address => {
    return getters.sortedMessages.filter(message => {
      return (
        (message.sender === address &&
          message.recipient === state.user.address) ||
        (message.sender === state.user.address && message.recipient === address)
      );
    });
  },

  sortedMessages: (state, getters) => {
    return Object.values(state.messages).sort((a, b) => {
      switch (a.block) {
        case b.block:
          return a.index - b.index;
        case null:
          return 1;
        default:
          switch (b.block) {
            case null:
              return -1;
            default:
              return a.block - b.block;
          }
      }

      // if (a.block === b.block) {
      //   return a.index - b.index;
      // }

      // if (a.block === null) {
      //   return -1;
      // }

      // if (b.block === null) {
      //   return 1;
      // }

      // return a.block - b.block;
    });
  },

  decrypt: (state, getters) => message => {
    try {
      return getters.decryptECIES
        .decrypt(bsv.deps.Buffer.from(message, "hex"))
        .toString();
    } catch (e) {
      return e;
    }
  },

  nextMempoolIndex: (state, getters) => {
    const messages = Object.values(state.messages);
    if (!messages) {
      return 0;
    }
    return Math.max(messages.filter(m => !m.block).map(m => m.index)) + 1;
  },

  getUser: (state, getters) => node => {
    const output = node.opReturn.find(c => c.cell[0].s === protocols.user);

    const publicKey = output ? output.cell[2].s : null;
    if (publicKey && !bsv.PublicKey.isValid(publicKey)) {
      throw new Error("Invalid public key for user");
    }
    return {
      address: node.address,
      name: output.cell[1].s,
      publicKey,
      keyPath: node.keyPath,
      tx: node.tx
    };
  },

  getMessage: (state, getters) => node => {
    const output = node.opReturn.find(c => c.cell[0].s === protocols.message);
    return {
      address: node.address,
      block: node.tx.blk ? node.tx.blk.i : null,
      sender: node.tx.parent.a,
      recipient: output.cell[1].s,
      content:
        node.tx.parent.a === state.user.address
          ? getters.decrypt(output.cell[3].s)
          : getters.decrypt(output.cell[2].s),
      keyPath: node.keyPath,
      tx: node.tx
    };
  }
};

export const plugins = [vuexLocal.plugin];
