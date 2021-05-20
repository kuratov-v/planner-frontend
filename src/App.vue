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
  data: () => ({
    //
  }),
};
</script>

<style>
#content {
  margin: 20px 3% 0 3%;
}
</style>