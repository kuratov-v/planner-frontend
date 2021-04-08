<template>
  <div>
    <v-app-bar color="blue darken-4" dark>
      <v-toolbar-title
        @click="
          () => {
            this.$router.push({ name: 'Home' });
          }
        "
        >Project title</v-toolbar-title
      >

      <v-divider class="mx-4" vertical></v-divider>

      <v-btn
        @click="
          () => {
            this.$router.push({ name: 'BudgetMain' });
          }
        "
        text
      >
        Budget
      </v-btn>

      <v-btn @click="() => {}" text> TODO </v-btn>

      <v-spacer />

      <div v-if="getUserInfo">
        <!--       <v-avatar size="36">
                <img :src="getUserInfo.photo_max_orig">
              </v-avatar> -->
        {{ getUserInfo.first_name }} {{ getUserInfo.last_name }}
        <v-menu bottom left offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-btn text disabled> Настройки </v-btn>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-btn text @click="logout"> Выход </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn icon class="mx-5" @click="vkAuth">
          <v-icon size="36px">mdi-vk</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "AppHeader",
  computed: mapGetters(["getUserInfo"]),
  methods: {
    ...mapActions(["logoutUser"]),
    vkAuth() {
      window.location.href =
        "https://oauth.vk.com/authorize?client_id=" +
        process.env.VUE_APP_VK_APP_ID +
        "&response_type=token&redirect_uri=http://localhost:8080/auth/vk/success/";
    },
    logout() {
      this.$router.go();
      this.logoutUser();
    },
  },
};
</script>
