import qrcode from "qrcode-generator";
import { Planter } from "planter";

export const state = () => {
  wallet: undefined;
  username: undefined;
  authenticate: false;
};

export const mutations = {
  setUsername(state, name) {
    state.username = name;
  },

  genWallet(state) {
    state.wallet = new Planter();
  }
};

export const actions = {};

export const getters = {
  getAddress: state => {
    if (!state.wallet) {
      return undefined;
    }
    return state.wallet.fundingAddress;
  },

  getQrDataURL: (state, getters) => {
    if (!state.wallet) {
      return undefined;
    }
    const typeNumber = 4;
    const errorCorrectionLevel = "L";
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(getters.getAddress);
    qr.make();
    return qr.createDataURL(20);
  }
};
