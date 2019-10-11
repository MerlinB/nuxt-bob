<template>
  <v-container class="ma-auto text-center">
    <p>Fund your wallet</p>
    <v-card class="ma-5">
      <v-img :src="getQrDataURL" aspect-ratio="1">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
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