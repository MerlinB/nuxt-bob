<template>
  <v-list>
    <v-list-item v-for="message in messages" :key="message.id">
      {{ messsage.content }}
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      recipient: {
        name: 'Vincent'
      },
      messages: [
        {
          id: 1,
          content: 'Hello, this is a message'
        }
      ]
    }
  }
}
</script>