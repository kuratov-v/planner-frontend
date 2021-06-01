<template>
  <div class="text-center">
    <h2>Для начала работы необходимо авторизоваться</h2>
    <v-btn @click="vkAuth" icon outlined x-large color="primary">
      <v-icon>mdi-vk</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "About",
  methods: {
    vkAuth() {
      window.location.href =
        "https://oauth.vk.com/authorize?response_type=code&client_id=" +
        process.env.VUE_APP_VK_APP_ID +
        "&redirect_uri=" +
        process.env.VUE_APP_VK_RESPONSE_URI;
    },
  },
};
</script>
