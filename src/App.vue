<template>
  <v-app>
    <AppHeader />
    <v-main>
      <div id="content">
        <router-view />
      </div>
    </v-main>
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
};
</script>

<style>
#content {
  margin: 1% 1% 0 1%;
}
</style>