<template>
  <div>
    <chats></chats>

    <nuxt-link to="/contacts">
      <v-btn class="mx-2" fab fixed right bottom dark color="teal">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </nuxt-link>
  </div>
</template>

<script>
import Chats from "../components/Chat/Chats.vue";

export default {
  middleware: "auth",
  components: {
    chats: Chats
  }
};
</script>
