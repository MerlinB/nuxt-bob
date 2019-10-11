<template>
  <div class="text-center ma-auto">
    <p>Welcome to BOB</p>
    <nuxt-link to="/signup">
      <v-btn color="primary">Create Account</v-btn>
    </nuxt-link>

    <!-- Workaround for weird nuxt routing issue (chunk loading error) -->
    <nuxt-link to="/signup/fundwallet"></nuxt-link>
  </div>
</template>

<script>
export default {
  layout: "blank"
};
</script>