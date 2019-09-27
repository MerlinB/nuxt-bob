<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawerToggle"
      temporary
      app
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click=""
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      color="primary"
      dark
      app
      elevate-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawerToggle = !drawerToggle"></v-app-bar-nav-icon>
      <v-toolbar-title>Chat</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="n in 5"
            :key="n"
            @click="() => {}"
          >
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
       <nuxt/>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawerToggle: false,
        items: [
          { title: 'Home', icon: 'mdi-home-city' },
          { title: 'My Account', icon: 'mdi-account' },
          { title: 'Users', icon: 'mdi-account-group-outline' },
        ],
      }
    },
    computed: {
      menuItems () {
        let items = [
          { icon: 'face', title: 'Register', route: '/register' },
          { icon: 'lock_open', title: 'Login', route: '/login' }
        ]
        if (this.userIsAuthenticated) {
          items = [
            {icon: 'chat', title: 'Create a Chat', route: '/create'}
          ]
        }
        return items
      },
      userIsAuthenticated () {
        return true
      },
    },
  }
</script>

