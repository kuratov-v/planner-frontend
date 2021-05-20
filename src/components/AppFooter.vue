<template>
  <v-footer inset app padless absolute>
    <v-card flat tile class="footer-card blue darken-4 white--text text-center">
      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Planner</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-vk", "mdi-instagram"],
  }),
};
</script>

<style>
.footer-card {
  width: 100%;
}
</style>