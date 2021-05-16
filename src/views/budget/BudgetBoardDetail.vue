<template>
  <div class="">
    <v-row>
      <h1>
        {{ board.name }}
        <v-btn
          @click="
            () => {
              this.$router.push({
                name: 'BudgetBoardSettings',
                params: { url: this.$route.params.url },
              });
            }
          "
          icon
        >
          <v-icon>mdi-tune</v-icon>
        </v-btn>
      </h1>
      <v-spacer />
      <v-btn outlined @click="openDialogCreateTransaction()">
        Добавить транзацию
      </v-btn>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <h2>Фильтры:</h2>
        <v-select
          v-model="selectedCategories"
          :items="categories"
          item-value="id"
          item-text="name"
          :menu-props="{ maxHeight: '400' }"
          label="Фильтр по категориям"
          multiple
          persistent-hint
        />
        <v-select
          v-model="selectedTransactionStatus"
          :items="transactionStatus"
          item-value="value"
          item-text="name"
          :menu-props="{ maxHeight: '400' }"
          label="Фильтр по статусу"
          persistent-hint
        />

        <v-row>
          <v-col cols="6">
            <v-menu
              v-model="dateFromMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="formatDate(dateFrom)"
                  label="Date from"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                first-day-of-week="1"
                locale="ru-Latn"
                v-model="dateFrom"
                @input="dateFromMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              v-model="dateToMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="formatDate(dateTo)"
                  label="Date to"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                locale="ru-Latn"
                first-day-of-week="1"
                v-model="dateTo"
                @input="dateToMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-btn @click="getBudgetBoardTransactions" text> Применить </v-btn>
        <v-btn @click="initialize" text> Сбросить фильтры </v-btn>
      </v-col>

      <v-col cols="12" md="9">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left" width="130px">Amount</th>
                <th class="text-center" width="120px">Date</th>
                <th class="text-left" width="125px">Category</th>
                <th class="text-left" width="125px" />
              </tr>
            </thead>

            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.name">
                <td>{{ transaction.name }}</td>
                <td>
                  {{ transaction.amount }}
                  <v-icon v-if="transaction.status == 'profit'" color="green">
                    mdi-chevron-up
                  </v-icon>
                  <v-icon v-else color="red"> mdi-chevron-down </v-icon>
                </td>
                <td class="text-center">
                  {{ transaction.date | moment("DD.MM.YYYY") }}
                </td>
                <td>
                  <span v-if="transaction.category != null">
                    {{ transaction.category.name }}
                  </span>
                  <span v-else> - </span>
                </td>
                <td>
                  <v-btn @click="openDialogEditTransaction(transaction)" icon>
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                  <v-btn @click="deleteTransaction(transaction.id)" icon>
                    <v-icon small> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">User Profile</span>
            </v-card-title>
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
                  <v-col cols="12">
                    <v-text-field
                      label="Amount"
                      v-model="modalData.amount"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formatDate(modalData.date)"
                          label="Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        locale="ru-Latn"
                        first-day-of-week="1"
                        v-model="modalData.date"
                        @input="menu = false"
                      />
                    </v-menu>
                  </v-col>

                  <v-select
                    v-model="modalData.category"
                    :items="categories"
                    item-value="id"
                    item-text="name"
                    :menu-props="{ maxHeight: '400' }"
                    label="Category"
                    persistent-hint
                  ></v-select>
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
    <div>
      <b>Expense</b>
      <chartPie :data="expenseData" />
    </div>
    <div>
      <b>Profit</b>
      <chartPie :data="profitData" />
    </div>
  </div>
</template>

<script>
import { HTTP } from "@/services/request";
import chartPie from "@/components/charts/Pie";
import moment from "moment";

export default {
  name: "BudgetBoardDetail",
  components: {
    chartPie,
  },
  data: () => ({
    board: null,
    transactions: null,
    categories: null,
    selectedCategories: null,
    dialog: false,
    modalData: {
      name: "",
      date: "",
      category: "",
      amount: "",
    },
    modalMode: 0, //	1-create, 2-edit
    menu: false,
    transactionStatus: [
      { value: null, name: "Все" },
      { value: "profit", name: "Доход" },
      { value: "expense", name: "Расход" },
    ],
    selectedTransactionStatus: null,
    dateFrom: String,
    dateTo: String,
    dateFromMenu: false,
    dateToMenu: false,
  }),
  methods: {
    getBudgetBoard() {
      var boardId = this.$route.params.url + "/";
      HTTP.get("budget-board/" + boardId).then((response) => {
        this.board = response.data;
      });
    },
    getCategories() {
      var boardId = this.$route.params.url + "/";
      HTTP.get("budget-board/" + boardId + "categories/").then((response) => {
        this.categories = response.data;
      });
    },
    getBudgetBoardTransactions() {
      var qs = require("qs");
      var params = {
        status: null,
        category: this.selectedCategories,
        status: this.selectedTransactionStatus,
        date_from: this.dateFrom,
        date_to: this.dateTo,
      };
      var boardId = this.$route.params.url + "/";
      HTTP.get("budget-board/" + boardId + "transactions/", {
        params: params,
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      }).then((response) => {
        this.transactions = response.data;
      });
    },
    deleteTransaction(id) {
      var boardId = this.$route.params.url + "/";
      HTTP.delete("budget-board/" + boardId + "transactions/" + id + "/").then(
        () => {
          this.initialize();
        }
      );
    },
    openDialogCreateTransaction() {
      this.modalMode = 1;
      this.modalData = {
        name: "",
        date: this.getToday(),
        category: "",
        amount: "",
        budget_board: this.board.id,
      };
      this.dialog = true;
    },
    openDialogEditTransaction(transaction) {
      this.modalMode = 2;
      const amount =
        transaction.status == "profit"
          ? transaction.amount
          : -transaction.amount;
      const category = transaction.category ? transaction.category.id : null;
      this.modalData = {
        id: transaction.id,
        name: transaction.name,
        date: transaction.date,
        category: category,
        amount: amount,
        budget_board: this.board.id,
      };
      this.dialog = true;
    },
    dialogSave() {
      switch (this.modalMode) {
        case 1:
          this.modalMode = 0;
          this.createTransaction();
          break;
        case 2:
          this.modalMode = 0;
          this.editTransaction();
          break;
      }
    },
    createTransaction() {
      const boardId = this.$route.params.url + "/";
      HTTP.post(
        "budget-board/" + boardId + "transactions/",
        this.modalData
      ).then(() => {
        this.dialog = false;
        this.initialize();
      });
    },
    editTransaction() {
      const boardId = this.$route.params.url + "/";
      HTTP.patch(
        "budget-board/" + boardId + "transactions/" + this.modalData.id + "/",
        this.modalData
      ).then(() => {
        this.dialog = false;
        this.initialize();
      });
    },
    initialize() {
      (this.selectedCategories = null),
        (this.dialog = false),
        (this.modalMode = 0),
        (this.menu = false),
        (this.selectedTransactionStatus = null),
        (this.dateFrom = this.getFirstDayOfMonth()),
        (this.dateTo = this.getLastDayOfMonth()),
        this.getBudgetBoard(),
        this.getBudgetBoardTransactions(),
        this.getCategories();
    },
    formatDate(date) {
      return moment(String(date)).format("DD.MM.YYYY");
    },
    getToday() {
      var today = new Date();
      return (
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate()
      );
    },
    getFirstDayOfMonth() {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      return (
        firstDay.getFullYear() +
        "-" +
        (firstDay.getMonth() + 1) +
        "-" +
        firstDay.getDate()
      );
    },
    getLastDayOfMonth() {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var lastDay = new Date(y, m + 1, 0);
      return (
        lastDay.getFullYear() +
        "-" +
        (lastDay.getMonth() + 1) +
        "-" +
        lastDay.getDate()
      );
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    profitTransactions() {
      return this.transactions.filter((t) => t.status == "profit");
    },
    expenseTransactions() {
      return this.transactions.filter((t) => t.status == "expense");
    },
    profitData() {
      var result = [];
      this.profitTransactions.forEach((element) => {
        const key = element.category ? element.category.name : "Не указано";
        const val = parseFloat(element.amount);
        if (key in result) result[key] += val;
        else result[key] = val;
      });
      return result;
    },
    expenseData() {
      var result = {};
      this.expenseTransactions.forEach((element) => {
        const key = element.category ? element.category.name : "Не указано";
        const val = parseFloat(element.amount);
        if (key in result) result[key] += val;
        else result[key] = val;
      });
      return result;
    },
  },
};
</script>
