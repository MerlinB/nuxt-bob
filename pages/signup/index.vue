<template>
  <v-container class="ma-auto">
    <v-form ref="form" v-model="valid" lazy-validation class="text-center">
      <p>Let us know who you are</p>
      <v-text-field v-model="name" :rules="nameRules" label="Username" class="mx-5" required></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mt-8" @click="validate">Continue</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

export default {
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
        this.genWallet();
        this.$router.push("signup/fund_wallet");
      }
    },
    ...mapMutations(["setUsername", "genWallet"])
  }
};
</script>