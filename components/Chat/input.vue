<template>
  <v-footer id="chatInput" padless tile app style="background: white;">
    <v-textarea
      id="input"
      v-model="message"
      row-height="1"
      :disabled="sending"
      :auto-grow="true"
      :autofocus="true"
      :loading="sending"
      style="margin-left: 1em;"
      @keydown.enter.prevent
      @keyup.enter.prevent="sendMessage"
    ></v-textarea>
    <v-btn icon style="margin: 0em 1em;" @click="sendMessage">
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </v-footer>
</template>

<script>
import { protocols } from "../../defaults";
import bsvEcies from "bsv/ecies";
import bsv from "bsv";

export default {
  data: () => ({
    message: "",
    sending: false
  }),
  props: ["recipient"],
  computed: {
    recipientECIES() {
      return bsvEcies().publicKey(
        bsv.PublicKey.fromString(this.recipient.opReturn.s8)
      );
    }
  },
  methods: {
    async sendMessage() {
      this.sending = true;

      const message = this.recipientECIES.encrypt(this.message).toString("hex");
      const messageToSelf = this.$store.getters.encryptECIES
        .encrypt(this.message)
        .toString("hex");

      const response = await this.$store.getters.userNode.createChild(
        this.$store.getters.wallet,
        {
          data: [
            protocols.message,
            this.recipient.address,
            message,
            messageToSelf
          ]
        }
      );
      console.log(response);
      if (response.txid) {
        this.$store.dispatch("addMessage", {
          address: response.address,
          recipient: this.recipient.address,
          content: this.message
        });
      }
      this.message = "";
      this.sending = false;
      document.getElementById("input").focus();
    }
  }
};
</script>