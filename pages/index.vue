<template>
  <v-app>
    <v-app-bar color="primary" dark app elevate-on-scroll>
      <v-toolbar-title>BOB Chat</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$nuxt.$router.push(`/profile`)">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <chats></chats>

      <nuxt-link to="/contacts">
        <v-btn class="mx-2" fab fixed right bottom dark color="teal">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </nuxt-link>
    </v-content>
  </v-app>
</template>

<script>
import Chats from "../components/Chat/Chats.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  middleware: "auth",
  pageTitle: "BOB Chat",
  components: {
    chats: Chats
  },
  methods: {
    logout() {
      this.resetUser();
      this.$router.push("/setup");
    },
    ...mapMutations(["resetUser"])
  }
};
</script>
