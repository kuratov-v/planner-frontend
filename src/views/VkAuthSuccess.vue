<template>
  <div class="text-center">
    <h2>Авторизация</h2>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "VkAuthSuccess",
  methods: {
    authenticateUser() {
      this.$store.dispatch("authUser", this.$route.query.code).then(() => {
        this.$router.push({ name: "Home" });
      });
    },
  },
  created() {
    this.authenticateUser();
  },
};
</script>
