<template>
  <v-app>
    <AppHeader />
    <div id="content">
      <router-view />
    </div>
    <AppFooter />
  </v-app>
</template>

<style>
</style>

<script>
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  name: "App",
  data: () => ({
    //
  }),
};
</script>

<style>
#content {
  padding-bottom: 150px;
  margin: 30px 5% 0 5%;
}
</style>