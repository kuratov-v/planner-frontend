<template>
  <div class="">
    <h2>Настройки</h2>
    <v-text-field label="Название доски" v-model="board.name"> </v-text-field>
    <v-btn text color="green" @click="editBudgetBoard"> Сохранить </v-btn>
    <v-btn text color="red" @click="deleteBudgetBoard"> Удалить </v-btn>

    <h2>Категории</h2>
    <v-simple-table style="width: 370px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left" width="250px">Name</th>
            <th class="text-left" width="120px" />
          </tr>
        </thead>

        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>
              <v-btn @click="openDialogEditCategory(category)" icon>
                <v-icon small> mdi-pencil </v-icon>
              </v-btn>
              <v-btn @click="deleteCategory(category.id)" icon>
                <v-icon small> mdi-delete </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Name"
                      v-model="modalData.name"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogSave()"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-btn outlined @click="openDialogCreateCategory"> Создать </v-btn>

    <h2>Управление доступом</h2>
    <div>
      В разработке...
      <v-icon>mdi-wrench</v-icon>
    </div>
  </div>
</template>

<script>
import axios from "@/services/request";

export default {
  name: "BudgetBoardSettings",
  data: () => ({
    board: null,
    modalData: {
      name: "",
    },
    categories: null,
    modalMode: 0,
    dialog: false,
  }),
  computed: {
    pageURL() {
      return "budget-board/" + this.$route.params.url + "/";
    },
  },
  methods: {
    getBudgetBoard() {
      axios.get(this.pageURL).then((response) => {
        this.board = response.data;
      });
    },
    editBudgetBoard() {
      axios.patch(this.pageURL, this.board).then(() => {
        this.$router.push({
          name: "BudgetBoardDetail",
          params: { url: this.board.id },
        });
      });
    },
    deleteBudgetBoard() {
      axios.delete(this.pageURL).then(() => {
        {
          this.$router.push({ name: "BudgetMain" });
        }
      });
    },
    getCategories() {
      axios.get(this.pageURL + "categories/").then((response) => {
        this.categories = response.data;
      });
    },
    openDialogCreateCategory() {
      this.modalMode = 1;
      this.modalData = {
        name: "",
      };
      this.dialog = true;
    },
    openDialogEditCategory(category) {
      this.modalMode = 2;
      this.modalData = {
        id: category.id,
        name: category.name,
      };
      this.dialog = true;
    },
    dialogSave() {
      switch (this.modalMode) {
        case 1:
          this.modalMode = 0;
          this.createCategory();
          break;
        case 2:
          this.modalMode = 0;
          this.editCategory();
          break;
      }
    },
    createCategory() {
      axios
        .post(this.pageURL + "categories/", {
          name: this.modalData.name,
          budget_board: this.board.id,
        })
        .then(() => {
          this.initialize();
        });
    },
    editCategory() {
      axios
        .patch(this.pageURL + "categories/" + this.modalData.id + "/", {
          name: this.modalData.name,
        })
        .then(() => {
          this.initialize();
        });
    },
    deleteCategory(id) {
      axios.delete(this.pageURL + "categories/" + id + "/").then(() => {
        this.initialize();
      });
    },
    initialize() {
      this.modalMode = 0;
      this.dialog = false;
      this.getBudgetBoard();
      this.getCategories();
    },
  },
  created() {
    this.initialize();
  },
};
</script>
