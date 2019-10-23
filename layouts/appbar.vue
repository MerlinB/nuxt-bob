<template>
  <v-app>
    <v-app-bar color="primary" dark app elevate-on-scroll>
      <v-btn icon v-if="$nuxt.$route.path != '/'" @click="$nuxt.$router.push('/')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    title() {
      return this.$route.matched.map(r => {
        return r.components.default.options
          ? r.components.default.options.pageTitle
          : r.components.default.pageTitle;
      })[0];
    }
  }
};
</script>

