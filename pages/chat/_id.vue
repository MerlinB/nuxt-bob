<template>
  <v-app>
    <v-app-bar color="primary" dark app elevate-on-scroll>
      <v-btn icon @click="$nuxt.$router.push('/')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ recipientName }}</v-toolbar-title>
    </v-app-bar>

    <v-content style="background: #eceff1">
      <v-list color="transparent" tile dense class="messageList">
        <!-- <div class="d-flex flex-column flex-wrap"> -->
        <v-list-item
          selectable
          :class="['msg', (sentByMe(message) ? 'me': 'them')]"
          v-for="(message, i) in messages"
          :key="i"
        >
          <div :class="['speech-bubble']">{{ decrypt(message) }}</div>
        </v-list-item>
        <!-- </div> -->
      </v-list>

      <!-- <div class="flex-grow-1">
        <v-textarea row-height="1" :auto-grow="true"></v-textarea>
        <v-btn icon>
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>-->
    </v-content>

    <v-footer id="chatInput" padless tile app style="background: white;">
      <v-textarea
        v-model="message"
        row-height="1"
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
  </v-app>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { TreeHugger } from "planter";
import { protocols } from "../../defaults";
import bsvEcies from "bsv/ecies";
import bsv from "bsv";

export default {
  middleware: "auth",
  data: () => ({
    recipient: undefined,
    message: "",
    sending: false
  }),
  computed: {
    ...mapGetters(["wallet", "userNode", "ecies"]),
    recipientName() {
      if (this.recipient) {
        return this.recipient.opReturn.s7;
      }
    },
    messages() {
      if (!this.recipient) {
        return [];
      }
      return this.$nuxt.$store.getters.messagesByChat(this.recipient.address);
    },
    recipientEcies() {
      return bsvEcies().publicKey(
        bsv.PublicKey.fromString(this.recipient.opReturn.s8)
      );
    }
  },
  async created() {
    const find = {
      "out.s6": protocols.user,
      "node.a": this.$nuxt.$route.params.id
    };
    const response = await TreeHugger.findSingleNode({ find });
    if (response) {
      this.recipient = response;
    }
    await this.syncMessages();
    // this.createSocket();
  },
  methods: {
    ...mapActions(["syncReceivedMessages", "syncSentMessages"]),

    async sendMessage() {
      this.sending = true;

      const message = this.recipientEcies.encrypt(this.message).toString("hex");
      const messageToSelf = this.ecies.encrypt(this.message).toString("hex");

      const response = await this.userNode.createChild(this.wallet, {
        data: [
          protocols.message,
          this.recipient.address,
          message,
          messageToSelf
        ]
      });
      this.message = "";
      console.log(response);
      this.sending = false;
    },

    async syncMessages() {
      await this.syncSentMessages(this.recipient.address);
      await this.syncReceivedMessages(this.recipient.address);
    },

    // createSocket() {
    //   // Not available yet
    //   const find = {
    //     v: 3,
    //     q: {
    //       find: {
    //         "parent.id": this.userNode.id,
    //         head: true,
    //         "out.s6": protocols.message,
    //         "out.s7": { $in: [this.recipient.address, this.userNode.address] }
    //       }
    //     }
    //   };
    //   var b64 = btoa(JSON.stringify(find));
    //   var socket = new EventSource(
    //     "https://bob.planaria.network/s/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/" +
    //       b64
    //   );
    //   // Handle new messages
    //   socket.onmessage = function(e) {
    //     console.log(JSON.parse(e.data));
    //   };
    // },

    // async syncMessages() {
    //   const find = {
    //     "parent.id": this.userNode.id,
    //     head: true,
    //     "out.s6": protocols.message,
    //     "out.s7": { $in: [this.recipient.address, this.userNode.address] }
    //   };
    //   // console.log(JSON.stringify(find));
    //   const me = await this.wallet.findAllNodes(find);
    //   this.me = me.filter(node => node.opReturn.s8).reverse();
    // },

    decrypt(message) {
      try {
        if (this.sentByMe(message)) {
          return this.ecies
            .decrypt(bsv.deps.Buffer.from(message.opReturn.s9, "hex"))
            .toString();
        } else {
          return this.recipientEcies
            .decrypt(bsv.deps.Buffer.from(message.opReturn.s8, "hex"))
            .toString();
        }
      } catch (e) {
        return e;
      }
    },

    sentByMe(message) {
      return message.tx.parent.a === this.userNode.address;
    }
  }
};
</script>

<style scoped>
.messageList {
  border-radius: 0;
}

.messageList .v-list-item {
  margin-left: 0;
  margin-right: 0;
}

.msg {
  font-size: 14px;
  margin: 1em;
  display: flex;
}

.me.msg {
  flex-direction: row-reverse;
  margin-left: 3em;
}

.them.msg {
  flex-direction: row;
  margin-right: 3em;
}

.me .speech-bubble {
  background: #00766c;
  color: white;
}

.them .speech-bubble {
  background: white;
  color: #333;
}

.speech-bubble {
  position: relative;
  border-radius: 0.3em;
  padding: 0.5em;
  width: fit-content;
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border: 1.2em solid transparent;
  border-bottom: 0;
  margin-top: -10px;
}

.me .speech-bubble::after {
  border-left-color: #00766c;
  border-right: 0;
  right: 0;
  margin-right: -0.8em;
}

.them .speech-bubble::after {
  border-right-color: white;
  border-left: 0;
  left: 0;
  margin-left: -0.8em;
}
</style>