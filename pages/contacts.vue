<template>
  <v-list>
    <v-list-item v-for="user in users" :key="user.id" @click>
      <v-list-item-avatar>
        <v-img></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="user.name"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { TreeHugger } from "planter";
import { protocols } from "../defaults";

export default {
  middleware: "auth",
  data: () => ({
    users: []
  }),
  created: function() {
    const find = {
      "out.s7": protocols.user
    };
    const users = TreeHugger.findAllNodes({ find });
    this.users = users;
  }
};
</script>