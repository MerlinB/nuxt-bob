<template>
    <v-list>
      <v-list-item
        v-for="chat in chats"
        :key="chat.name"
        @click=""
      >
        <v-list-item-avatar>
          <v-img :src="chat.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="chat.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
</template>

<script>
  export default{
    data() {
      return {
        chats: [
          {
            name: 'First chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Second chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
          {
            name: 'Some chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
          },
          {
            name: 'Another chat',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          },
        ]
      }
    }
  }
</script>
