<template>
  <v-container class="ma-auto text-center">
    <p>Fund your wallet</p>
    <v-card class="mx-auto my-5" max-width="300">
      <v-img :src="qrDataURL" aspect-ratio="1">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-card>
    <v-row>
      <v-col>
        <p class="text-uppercase">{{ wallet.fundingAddress }}</p>
        <v-btn icon @click="copyAddress">
          <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-btn
      color="success"
      class="mt-8"
      :loading="loading"
      @click="createAccount"
      @keyup.enter.native="createAccount"
    >Create Account</v-btn>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import qrcode from "qrcode-generator";

export default {
  middleware: ({ store, redirest }) => {
    if (store.state.userAddress && store.state.xprivKey) {
      redirect("/");
    }
    if (!store.state.username) {
      redirect("/signup");
    }
  },
  layout: "blank",
  data: () => ({
    loading: false,
    qrDataURL: undefined
  }),
  computed: {
    ...mapGetters(["wallet"])
    // ...mapState(["qrDataURL"])
  },
  created: function() {
    if (!this.$store.state.xprivKey) {
      this.genWallet();
    }
    this.genQRDataURL();
  },
  methods: {
    async copyAddress() {
      try {
        await this.$copyText(this.wallet.fundingAddress);
        this.$toast.show("Copied to clipboard", {
          position: "bottom-center",
          duration: 1000
        });
      } catch (e) {
        console.error(e);
      }
    },
    async createAccount() {
      this.loading = true;

      try {
        await this.createUserNode();
      } catch (e) {
        this.$toast.show(e, {
          type: "error",
          position: "bottom-center",
          duration: 2000
        });
        this.loading = false;
        return;
      }
      let tries = 0;
      while (!this.$store.state.userNode && tries < 15) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.syncUserNode();
        tries += 1;
        console.log(tries);
      }
      this.loading = false;
      this.$router.push("/");
    },

    async genQRDataURL() {
      const typeNumber = 3;
      const errorCorrectionLevel = "L";
      const qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(this.wallet.fundingAddress);
      await qr.make();
      const url = await qr.createDataURL(20);
      this.qrDataURL = url;
    },
    ...mapActions(["createUserNode", "genWallet", "syncUserNode"])
  }
};
</script>