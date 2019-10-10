import { Planter, TreeHugger } from "planter";

export const state = () => {
  messages: [];
};

export const mutations = {
  add(state, messages) {
    state.messages.concat(messages);
  }
};

// export const actions = {
//   async getMessages({ commit }) {
//     await Planter.
//   }
// };
