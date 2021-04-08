<template>
  <div class="text-center">
    <h1>Page not found</h1>
    <v-btn
      @click="
        () => {
          this.$router.push({ name: 'Home' });
        }
      "
      text
    >
     Вернуться на главную 
    </v-btn>
  </div>
</template>