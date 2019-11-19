<template>
  <div class="text-center ma-auto">
    <v-img src="/BOB_Logo.png" :contain="true" aspect-ratio="1.5"></v-img>
    <nuxt-link to="/signup">
      <v-btn color="secondary darken-2">Create Account</v-btn>
    </nuxt-link>
    <v-btn color="secondary black--text" to="login">Login</v-btn>
    <!-- <v-row>
      <v-col>
        <v-btn color="secondary darken-4" :loading="loading" @click="chooseUser">Testwallet</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="selectUser">
      <v-card>
        <v-list>
          <v-list-item v-for="(user, i) in users" :key="i" @click="login(user)">
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>-->

    <!-- Workaround for weird nuxt routing issue (chunk loading error) -->
    <nuxt-link to="/signup/fundwallet"></nuxt-link>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { protocols } from "../defaults";

export default {
  middleware: ({ store, redirect }) => {
    if (store.state.user) {
      return redirect("/");
    }
  },
  layout: "blank",
  data() {
    return {
      loading: false,
      users: [],
      selectUser: false
    };
  },
  computed: mapGetters(["wallet"]),
  methods: {
    // async chooseUser() {
    //   this.setXprivKey(
    //     "xprv9s21ZrQH143K2zJKULiRGhabnrAmZ68bzGh3LhivsgkW5U44meyTup6zeqc6vZa2PfM6x1KqoqVTauEA1qubAPNqsm87yAhHn4c9HTsohTb"
    //   );
    //   await this.syncUsers();
    //   this.selectUser = true;
    // },

    async login(user) {
      this.setUser(user);
      this.$router.push("/");
    },
    async syncUsers() {
      this.loading = true;
      const nodes = await this.wallet.findAllNodes({
        find: {
          "out.tape.cell": { $elemMatch: { s: protocols.user, i: 0 } }
        }
      });
      this.users = nodes.map(node => this.$store.getters.getUser(node));
      this.loading = false;
    },
    ...mapMutations(["setMnemonic", "setUser"])
  }
};
</script>
