<template>
  <v-app>
    <v-app-bar color="primary black--text" dark app elevate-on-scroll>
      <v-btn icon @click="$nuxt.$router.push('/')">
        <v-icon color="black">mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Profile</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container class="ma-auto text-center mt-5">
        <h1>{{ user.name }}</h1>
        <v-card class="mx-auto my-5" max-width="300">
          <v-img :src="qrDataURL" aspect-ratio="1">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
        <h3>Balance: {{ balance }} sats</h3>
        <p class="text-uppercase">{{ wallet.fundingAddress }}</p>

        <v-btn icon @click="copyAddress">
          <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
        </v-btn>

        <v-row>
          <v-col>
            <v-btn
              color="secondary black--text"
              @click="showMnemonic = !showMnemonic"
            >Show Mnemonic Seed</v-btn>
          </v-col>
        </v-row>

        <v-dialog v-model="showMnemonic" max-width="290">
          <v-card>
            <v-card-title class="headline">Mnemonic Seed</v-card-title>
            <v-card-text selectable>{{ this.mnemonic }}</v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import qrcode from "qrcode-generator";
import Mnemonic from "bsv/mnemonic";

export default {
  middleware: "auth",
  data: () => ({
    qrDataURL: undefined,
    showMnemonic: false
  }),
  computed: {
    ...mapGetters(["wallet", "balance"]),
    ...mapState(["user", "mnemonic"])
  },
  created() {
    this.syncUTXOs();
    this.genQRDataURL();
  },
  methods: {
    ...mapActions(["syncUTXOs"]),
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
    async genQRDataURL() {
      const typeNumber = 3;
      const errorCorrectionLevel = "L";
      const qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(this.wallet.fundingAddress);
      await qr.make();
      const url = await qr.createDataURL(20);
      this.qrDataURL = url;
    }
  }
};
</script>