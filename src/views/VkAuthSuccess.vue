<template>
  <div></div>
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
