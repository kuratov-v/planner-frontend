<template>
  <div>
    <v-app-bar color="blue darken-4" dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="mini = !mini"></v-app-bar-nav-icon>
      <v-toolbar-title
        class="logo"
        @click="
          () => {
            this.$router.push({ name: 'Home' });
          }
        "
        >Planner
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      color="blue darken-3"
      dark
      v-model="drawer"
      :mini-variant="mini"
      app
      clipped
      permanent
    >
      <v-list dense>
        <v-list-item link v-if="getUserInfo">
          <v-list-item-action>
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ getUserInfo.first_name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          v-for="item in menuItems"
          :key="item.name"
          @click="pushToRoute(item.pageUrl)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list dense>
          <v-list-item link v-if="getUserInfo" @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Выйти</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link v-else @click="vkAuth">
            <v-list-item-action>
              <v-icon>mdi-vk</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Авторизация</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "AppHeader",
  computed: mapGetters(["getUserInfo"]),
  data: () => ({
    drawer: true,
    mini: true,
    menuItems: [
      { icon: "mdi-home-outline", name: "Главная", pageUrl: "Home" },
      { icon: "mdi-wallet-outline", name: "Бюджет", pageUrl: "BudgetMain" },
      { icon: "mdi-bullseye-arrow", name: "Цели", pageUrl: "PurposeList" },
      {
        icon: "mdi-checkbox-multiple-marked-outline",
        name: "Задачи",
        pageUrl: "TodoProjects",
      },
    ],
  }),
  methods: {
    ...mapActions(["logoutUser"]),
    vkAuth() {
      window.location.href =
        "https://oauth.vk.com/authorize?response_type=code&client_id=" +
        process.env.VUE_APP_VK_APP_ID +
        "&redirect_uri=" +
        process.env.VUE_APP_VK_RESPONSE_URI;
    },
    pushToRoute(pageUrl) {
      this.$router.push({ name: pageUrl });
    },
    logout() {
      this.$router.go();
      this.logoutUser();
    },
  },
};
</script>

<style scoped>
.logo:hover {
  cursor: pointer;
}
</style>