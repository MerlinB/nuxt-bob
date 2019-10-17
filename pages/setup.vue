<template>
  <div class="text-center ma-auto">
    <p>Welcome to BOB</p>
    <nuxt-link to="/signup">
      <v-btn color="primary">Create Account</v-btn>
    </nuxt-link>
    <v-btn color="secondary" @click="syncUser">Login</v-btn>

    <!-- Workaround for weird nuxt routing issue (chunk loading error) -->
    <nuxt-link to="/signup/fundwallet"></nuxt-link>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  middleware: ({ store, redirect }) => {
    if (store.state.xprivKey) {
      if (store.state.userNode) {
        return redirect("/");
      }
      return redirect("/signup");
    }
  },
  layout: "blank",
  methods: {
    async syncUser() {
      await this.syncUserNode();
      if (this.$store.state.userNode) {
        this.$router.push("/");
      } else {
        this.$toast.show("No user profile found", {
          type: "error",
          position: "bottom-center",
          duration: 2000
        });
      }
    },
    ...mapActions(["syncUserNode"])
  }
};
</script>