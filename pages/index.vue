<template>
  <div>
    <chats></chats>
  </div>
</template>

<script>
import Chats from "../components/Chat/Chats.vue";

export default {
  middleware: "auth",
  components: {
    chats: Chats
  }
};
</script>
