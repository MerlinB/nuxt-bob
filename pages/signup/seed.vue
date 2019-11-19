<template>
  <v-container class="ma-auto text-center">
    <p>This is your mnemonic seed. Save it!</p>
    <p class="mb-8">
      <b>{{ mnemonic }}</b>
    </p>

    <nuxt-link to="/">
      <v-btn color="secondary darken-2">Continue</v-btn>
    </nuxt-link>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  middleware: ({ store, redirect }) => {
    if (!store.state.mnemonic) {
      redirect("/");
    }
  },
  layout: "blank",
  data: () => ({}),

  computed: {
    ...mapState(["mnemonic"])
  }
};
</script>