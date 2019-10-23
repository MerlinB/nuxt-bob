<template>
  <div class="text-center ma-auto">
    <p>Welcome to BOB</p>
    <nuxt-link to="/signup">
      <v-btn color="primary">Create Account</v-btn>
    </nuxt-link>
    <v-btn color="secondary" @click="syncUser">Login</v-btn>

    <!-- Workaround for weird nuxt routing issue (chunk loading error) -->
    <nuxt-link to="/signup/fundwallet"></nuxt-link>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  middleware: ({ store, redirect }) => {
    if (store.state.userNodeTx) {
      return redirect("/");
    }
  },
  layout: "blank",
  methods: {
    async syncUser() {
      this.setXprivKey(
        "xprv9s21ZrQH143K2zJKULiRGhabnrAmZ68bzGh3LhivsgkW5U44meyTup6zeqc6vZa2PfM6x1KqoqVTauEA1qubAPNqsm87yAhHn4c9HTsohTb"
      );
      await this.syncUserNode();
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
    ...mapActions(["syncUserNode"]),
    ...mapMutations(["setXprivKey"])
  }
};
</script>