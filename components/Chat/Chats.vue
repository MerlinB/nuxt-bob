<template>
  <v-list>
    <v-list-item
      v-for="(contact, i) in contacts"
      :key="i"
      @click="$nuxt.$router.push(`/chat/${contact.address}`)"
    >
      <!-- <v-list-item-avatar>
        <v-img :src="chat.avatar"></v-img>
      </v-list-item-avatar>-->

      <v-list-item-content>
        <v-list-item-title v-text="contact.name"></v-list-item-title>
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
  computed: mapState(["contacts"]),

  methods: {
    ...mapActions(["syncMessages", "syncContacts"])
  },

  async created() {
    // await this.syncReceivedMessages();
    // await this.syncSentMessages();
    await this.syncMessages();
    await this.syncContacts();
  }
};
</script>
