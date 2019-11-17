<template>
  <v-app>
    <v-app-bar color="primary" app elevate-on-scroll>
      <v-btn icon @click="$nuxt.$router.push('/')">
        <v-icon color="black">mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ recipient.name }}</v-toolbar-title>
    </v-app-bar>

    <v-content style="background: #eceff1">
      <v-list
        color="transparent"
        tile
        dense
        class="messageList"
        id="messageList"
      >
        <v-list-item
          selectable
          :class="['msg', sentByMe(message) ? 'me' : 'them']"
          v-for="(message, i) in messages"
          :key="i"
        >
          <div :class="['speech-bubble']">
            <span v-html="linkify(message.content)"></span>
            <span v-if="sentByMe(message)">
              <v-icon dark small>
                {{ message.confirmed ? "mdi-check-all" : "mdi-check" }}
              </v-icon>
            </span>
          </div>
        </v-list-item>
      </v-list>
    </v-content>

    <chatInput :recipient="recipient"></chatInput>
  </v-app>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { TreeHugger } from "planter";
import { protocols } from "../../defaults";
import bsv from "bsv";
import chatInput from "../../components/Chat/input.vue";
import linkifyStr from "linkifyjs/string";

export default {
  middleware: "auth",
  components: { chatInput },
  computed: {
    ...mapGetters(["decryptECIES"]),
    ...mapState(["user"]),
    address() {
      return this.$nuxt.$route.params.id;
    },
    messages() {
      if (!this.recipient) {
        return [];
      }
      return this.$store.getters.messagesByChat(this.address);
    },
    recipient() {
      return this.$store.state.contacts[this.address];
    },
    recipientName() {
      return this.recipient ? this.recipient.name : "";
    }
  },
  async created() {
    $nuxt.$vuetify.goTo(9999999);
    await this.syncContacts([this.address]);
    await this.syncMessages();
    // this.createSocket();
  },
  methods: {
    ...mapActions(["syncMessages", "syncContacts"]),

    linkify(content) {
      return linkifyStr(content);
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

    sentByMe(message) {
      return message.sender === this.user.address;
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
  background: #48acb8;
  color: #ffffff;
}

.them .speech-bubble {
  background: #ffffff;
  color: #333;
}

.speech-bubble {
  position: relative;
  border-radius: 0.3em;
  padding: 0.5em;
  width: fit-content;
  word-break: break-all;
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
  border-left-color: #48acb8;
  border-right: 0;
  right: 0;
  margin-right: -0.8em;
}

.them .speech-bubble::after {
  border-right-color: #ffffff;
  border-left: 0;
  left: 0;
  margin-left: -0.8em;
}
</style>
