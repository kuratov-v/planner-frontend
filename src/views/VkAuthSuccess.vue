<template>
  <div></div>
</template>

<script>
import axios from "axios";

export default {
  name: "VkAuthSuccess",
  methods: {
    authenticateUser() {
      const str = this.$route.hash.substring(1);
      var hash_data = JSON.parse(
        '{"' + str.replace(/&/g, '", "').replace(/=/g, '": "') + '"}'
      );
      var vk_token = hash_data["access_token"];
      this.$store.dispatch("authUser", vk_token).then(() => {
        this.$router.push({ name: "Home" });
      });
    },
  },
  created() {
    this.authenticateUser();
  },
};
</script>
