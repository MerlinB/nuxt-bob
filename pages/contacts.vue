<template>
  <v-app>
    <v-app-bar color="primary" dark app elevate-on-scroll>
      <v-btn icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title v-show="!showSearch">Contacts</v-toolbar-title>
      <v-text-field
        hide-details
        placeholder="Type keyword..."
        v-show="showSearch"
        v-model="search"
        @keyup="searchUsers"
      ></v-text-field>

      <div class="flex-grow-1"></div>

      <v-btn icon @click="searchUsers">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-progress-linear
        :active="activeSearch"
        :indeterminate="activeSearch"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-app-bar>

    <v-content>
      <v-list v-show="!activeSearch">
        <v-list-item
          v-for="user in users"
          :key="user.address"
          @click="$nuxt.$router.push(`/chat/${user.address}`)"
        >
          <v-list-item-avatar>
            <v-img></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="user.opReturn.s7"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-content>
  </v-app>
</template>

<script>
import { TreeHugger } from "planter";
import { protocols } from "../defaults";
import { isValidUser } from "../utils";

export default {
  middleware: "auth",
  pageTitle: "Contacts",

  data: () => ({
    users: [],
    showSearch: false,
    activeSearch: false,
    search: "",
    title: "Contacts"
  }),

  async created() {
    const find = {
      "out.s6": protocols.user
    };
    const users = await TreeHugger.findAllNodes({ find });
    this.users = users.filter(user => isValidUser(user));
  },

  methods: {
    async searchUsers() {
      if (!this.showSearch) {
        this.showSearch = true;
        return;
      }
      this.activeSearch = true;

      const find = {
        "out.s6": protocols.user,
        "out.s7": { $regex: this.search, $options: "i" }
      };
      const users = await TreeHugger.findAllNodes({ find });
      this.users = users.filter(user => isValidUser(user));
      this.activeSearch = false;
    },

    back() {
      if (this.showSearch) {
        this.showSearch = false;
      } else {
        $nuxt.$router.push("/");
      }
    }
  }
};
</script>