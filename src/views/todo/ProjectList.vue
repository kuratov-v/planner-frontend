<template>
  <div>
    <h1>Projects</h1>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field label="New project" v-model="newProjectTitle" outlined />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn outlined @click="createProject"> Создать </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="project in projects" :key="project.id">
        <v-card max-width="300" outlined>
          <v-card-title>
            {{ project.title }}
          </v-card-title>
          <v-card-actions>
            <v-btn text @click="pushProjectDetail(project.id)">
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ProjectList",
  data: () => ({
    newProjectTitle: "",
  }),
  computed: mapGetters(["projects"]),
  mounted() {
    this.$store.dispatch("getProjects");
  },
  methods: {
    createProject() {
      this.$store.dispatch("createProject", { title: this.newProjectTitle });
      this.newProjectTitle = "";
    },
    pushProjectDetail(projectId) {
      this.$router.push({
        name: "TodoProjectsDetail",
        params: { id: projectId },
      });
    },
  },
  created() {
    this.getProjects();
  },
};
</script>
