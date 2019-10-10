<template>
  <v-container class="ma-auto text-center">
    <p>Fund your wallet</p>
    <v-card class="ma-5">
      <v-img :src="getQrDataURL" lazy-src="https://picsum.photos/id/11/10/6" aspect-ratio="1"></v-img>
    </v-card>
    <p class="text-uppercase">{{ getAddress }}</p>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  middleware: "auth",
  layout: "blank",
  computed: {
    ...mapGetters(["getAddress", "getQrDataURL"])
  }
};
</script>