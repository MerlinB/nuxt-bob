<template>
  <v-app>
    <v-app-bar color="primary black--text" dark app elevate-on-scroll>
      <v-btn icon @click="$nuxt.$router.push('/')">
        <v-icon color="black">mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-app-bar>

    <v-container class="ma-auto text-center">
      <!-- <v-form v-on:submit.prevent> -->
      <!-- <v-row v-for="n in 6" :key="n">
        <v-col v-for="m in 2" :key="m" cols="12" sm="6">
          <v-text-field :label="`${(n*2)+(m-1)-1}. Word`" class="pa-3" required></v-text-field>
        </v-col>
      </v-row>-->
      <v-text-field v-model="xprivKey" label="Enter your extended private Key" class="ma-5"></v-text-field>

      <v-btn
        :loading="loading"
        color="secondary black--text"
        class="mt-6"
        :disabled="!xprivKey"
        @click="login"
      >Continue</v-btn>
      <!-- </v-form> -->
    </v-container>
  </v-app>
</template>

<script>
import Mnemonic from "bsv/mnemonic";
import { mapMutations, mapGetters } from "vuex";
import { protocols } from "../defaults";

export default {
  data: () => ({
    xprivKey: "",
    mnemonic: "",
    loading: false,
    seedRules: [
      v => !!v || "Seed is required",
      v => (v && v.trim().split(" ").length == 12) || "Seed contains 12 words"
    ]
  }),
  computed: mapGetters(["wallet"]),
  methods: {
    ...mapMutations(["setUser"]),
    async login() {
      this.loading = true;
      try {
        // const mnemonic = Mnemonic.fromString(this.mnemonic);
        this.$store.commit("setXprivKey", this.xprivKey);

        const node = await this.wallet.findSingleNode({
          find: {
            "out.tape.cell": { $elemMatch: { s: protocols.user, i: 0 } }
          }
        });
        const user = this.$store.getters.getUser(node);
        this.setUser(user);
        this.$router.push("/");
      } catch (e) {
        this.$toast.show(e, {
          type: "error",
          position: "bottom-center",
          duration: 2000
        });
        this.loading = false;
        return;
      }
    }
  }
};
</script>