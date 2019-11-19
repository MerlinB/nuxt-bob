<template>
  <v-container class="ma-auto">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      class="text-center"
      v-on:submit.prevent="validate"
    >
      <p>Let us know who you are</p>
      <v-text-field v-model="name" :rules="nameRules" label="Username" class="mx-5" required></v-text-field>

      <v-btn :disabled="!valid" type="submit" color="secondary darken-2" class="mt-8">Continue</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  middleware: ({ store, redirect }) => {
    if (store.state.user && store.state.mnemonic) {
      redirect("/");
    }
  },
  layout: "blank",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 20) || "Name must be less than 20 characters"
    ]
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.setUsername(this.name);
        this.$router.push("/signup/fundwallet");
      }
    },
    ...mapMutations(["setUsername"])
  }
};
</script>