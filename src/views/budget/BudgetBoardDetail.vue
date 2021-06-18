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
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <div class="transaction-control sector">
          <chartPie :data="transactionsData" />
          <b>
            {{ dateFrom | moment("DD.MM.YYYY") }} -
            {{ dateTo | moment("DD.MM.YYYY") }}
          </b>
          <div>Доход: {{ transactionsData.profit }}</div>
          <div>Расход: {{ transactionsData.expense }}</div>
          <div>
            Итого: {{ transactionsData.profit - transactionsData.expense }}
          </div>
          <v-btn
            outlined
            @click="
              (createExpenseTransaction = false), openDialogCreateTransaction()
            "
          >
            Добавить доход
          </v-btn>
          <v-btn
            outlined
            @click="
              (createExpenseTransaction = true), openDialogCreateTransaction()
            "
          >
            Добавить расход
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="7">
        <div class="transactions sector">
          <v-row align="center">
            <v-col cols="12" md="6">
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
            </v-col>
            <v-col cols="12" md="2">
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
            <v-col cols="12" md="2">
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
            <v-col cols="12" md="2">
              <v-btn icon @click="getBudgetBoardTransactions" text>
                <v-icon> mdi-filter-plus </v-icon>
              </v-btn>
              <v-btn icon @click="initialize" text>
                <v-icon> mdi-filter-off </v-icon>
              </v-btn>
            </v-col>
          </v-row>

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
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td>{{ transaction.name }}</td>
                  <td>
                    <v-icon v-if="transaction.status == 'profit'" color="green">
                      mdi-chevron-up
                    </v-icon>
                    <v-icon v-else color="red"> mdi-chevron-down </v-icon>
                    {{ transaction.amount }}
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
        </div>
      </v-col>
    </v-row>

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ modalTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Название"
                      v-model="modalData.name"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Сумма"
                      v-model="modalData.amount"
                      required
                    />
                  </v-col>

                  <v-col cols="12" md="6">
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
                          label="Дата"
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

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="modalData.category"
                      :items="categories"
                      item-value="id"
                      item-text="name"
                      :menu-props="{ maxHeight: '400' }"
                      label="Категория"
                      persistent-hint
                    />
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
  </div>
</template>

<script>
import axios from "@/services/request";
import {
  getToday,
  getLastDayOfMonth,
  getFirstDayOfMonth,
} from "@/services/utils";
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
    createExpenseTransaction: true,
  }),
  methods: {
    getBudgetBoard() {
      axios.get(this.pageURL).then((response) => {
        this.board = response.data;
      });
    },
    getCategories() {
      axios.get(this.pageURL + "categories/").then((response) => {
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
      axios
        .get(this.pageURL + "transactions/", {
          params: params,
          paramsSerializer: (params) => {
            return qs.stringify(params, { indices: false });
          },
        })
        .then((response) => {
          this.transactions = response.data;
        });
    },
    deleteTransaction(id) {
      axios.delete(this.pageURL + "transactions/" + id + "/").then(() => {
        this.initialize();
      });
    },
    openDialogCreateTransaction() {
      this.modalMode = 1;
      this.modalData = {
        name: "",
        date: getToday(),
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
      if (this.createExpenseTransaction)
        this.modalData.amount = -this.modalData.amount;
      axios.post(this.pageURL + "transactions/", this.modalData).then(() => {
        this.dialog = false;
        this.initialize();
      });
    },
    editTransaction() {
      axios
        .patch(
          this.pageURL + "transactions/" + this.modalData.id + "/",
          this.modalData
        )
        .then(() => {
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
        (this.dateFrom = getFirstDayOfMonth()),
        (this.dateTo = getLastDayOfMonth()),
        this.getBudgetBoard(),
        this.getBudgetBoardTransactions(),
        this.getCategories();
    },
    formatDate(date) {
      return moment(String(date)).format("DD.MM.YYYY");
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    transactionsData() {
      let transactions = { profit: 0, expense: 0 };
      if (this.transactions) {
        this.transactions.forEach((element) => {
          const amount = parseFloat(element.amount);
          if (element.status == "profit") transactions.profit += amount;
          else transactions.expense += amount;
        });
        return transactions;
      }
    },
    pageURL() {
      return "budget-board/" + this.$route.params.url + "/";
    },
    modalTitle() {
      if (this.modalMode == 2) return "Изменить транзацию";
      else if (this.createExpenseTransaction) return "Добавить расход";
      else return "Добавить доход";
    },
  },
};
</script>

<style>
.transactions {
  max-width: 800px;
  padding: 15px;
}

.transaction-control {
  max-width: 400px;
}

.sector {
  border: 1px solid gray;
  border-radius: 10px;
}
</style>
