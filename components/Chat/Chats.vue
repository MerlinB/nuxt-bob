<template>
  <v-list>
    <v-list-item
      v-for="(contact, i) in contactNodes"
      :key="i"
      @click="$nuxt.$router.push(`/chat/${contact.address}`)"
    >
      <!-- <v-list-item-avatar>
        <v-img :src="chat.avatar"></v-img>
      </v-list-item-avatar>-->

      <v-list-item-content>
        <v-list-item-title v-text="contact.opReturn.s7"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["contactNodes"])
  },

  methods: {
    ...mapActions(["syncReceivedMessages", "syncSentMessages", "syncContacts"])
  },

  async created() {
    await this.syncReceivedMessages();
    await this.syncSentMessages();
    await this.syncContacts();
  }
};
</script>
