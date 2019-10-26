<template>
  <div class="text-center ma-auto">
    <p>Welcome to BOB</p>
    <nuxt-link to="/signup">
      <v-btn color="primary">Create Account</v-btn>
    </nuxt-link>
    <v-btn color="secondary" @click="chooseUser" :loading="loading">Login</v-btn>

    <v-dialog v-model="selectUser">
      <v-card>
        <v-list>
          <v-list-item v-for="(node, i) in userNodes" :key="i" @click="login(node)">
            <v-list-item-content>
              <v-list-item-title>{{ node.opReturn.s7 }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <!-- Workaround for weird nuxt routing issue (chunk loading error) -->
    <nuxt-link to="/signup/fundwallet"></nuxt-link>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { protocols } from "../defaults";
import { isValidUser } from "../utils";

export default {
  middleware: ({ store, redirect }) => {
    if (store.state.userNodeTx) {
      return redirect("/");
    }
  },
  layout: "blank",
  data() {
    return {
      loading: false,
      userNodes: [],
      selectUser: false
    };
  },
  computed: mapGetters(["wallet"]),
  methods: {
    async chooseUser() {
      this.setXprivKey(
        "xprv9s21ZrQH143K2zJKULiRGhabnrAmZ68bzGh3LhivsgkW5U44meyTup6zeqc6vZa2PfM6x1KqoqVTauEA1qubAPNqsm87yAhHn4c9HTsohTb"
      );
      await this.syncUserNodes();
      this.selectUser = true;
    },

    async login(user) {
      this.chooseUser = false;
      this.loading = true;
      if (!isValidUser(user)) {
        throw new Error("Invalid User");
      }

      this.setUserNodeAddress(user.address);
      await this.syncUserNode();
      this.loading = false;

      if (this.$store.state.userNodeTx) {
        this.$router.push("/");
      } else {
        this.$toast.show("No user profile found", {
          type: "error",
          position: "bottom-center",
          duration: 2000
        });
      }
    },

    async syncUserNodes() {
      this.loading = true;
      const nodes = await this.wallet.findAllNodes({
        "out.s6": protocols.user
      });
      this.userNodes = nodes.filter(node => isValidUser(node));
      this.loading = false;
    },
    ...mapActions(["syncUserNode"]),
    ...mapMutations(["setXprivKey", "setUserNodeAddress"])
  }
};
</script>