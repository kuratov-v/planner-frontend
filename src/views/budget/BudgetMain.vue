<template>
  <div class="">
    <h1>Доски</h1>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          label="Название новой доски"
          v-model="budgetBoardName"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn outlined @click="createBudgetDesk"> Создать </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="board in boards" :key="board.id">
        <v-card max-width="300" outlined>
          <v-card-title>
            {{ board.name }}
          </v-card-title>
          <v-card-actions>
            <v-btn text @click="pushBudgetDeskDetail(board.id)">
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { HTTP } from "@/services/request";

export default {
  name: "BudgetBoardList",
  data: () => ({
    boards: [],
    budgetBoardName: "",
  }),
  methods: {
    getGroups() {
      HTTP.get("budget-board/").then((response) => {
        this.boards = response.data;
      });
    },
    createBudgetDesk() {
      const data = { name: this.budgetBoardName };
      HTTP.post("budget-board/", data).then(() => {
        this.budgetBoardName = "";
        this.getGroups();
      });
    },
    pushBudgetDeskDetail(url) {
      this.$router.push({ name: "BudgetBoardDetail", params: { url: url } });
    },
  },
  created() {
    this.getGroups();
  },
};
</script>
