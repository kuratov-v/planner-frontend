<template>
  <div>
    <h2>
      {{ purpose.name }}
      <v-btn
        @click="
          () => {
            this.$router.push({
              name: 'PurposeSettings',
              params: { url: this.$route.params.url },
            });
          }
        "
        icon
      >
        <v-icon>mdi-tune</v-icon>
      </v-btn>

      <v-btn icon @click="openDialog()">
        <v-icon>mdi-pencil-plus</v-icon>
      </v-btn>
    </h2>

    <v-progress-linear
      rounded
      :value="progress"
      height="25"
      v-if="!purpose.invert_value"
    >
      <strong>{{ Math.ceil(progress) }}%</strong>
    </v-progress-linear>

    <v-row>
      <v-col cols="12" md="6">
        <div>Описание: {{ purpose.description }}</div>
        <div>Планируемый результат: {{ purpose.end_value }}</div>
        <div>
          Планируемая дата завершения:
          {{ purpose.end_date | moment("DD.MM.YYYY") }}
        </div>
        <div>Достигнутый результат: {{ purpose.status }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Value</th>
                <th class="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in purposeResults" :key="result.id">
                <td>{{ result.value }}</td>
                <td>{{ result.date | moment("DD.MM.YYYY") }}</td>
                <td>
                  <v-btn @click="deletePurposeResult(result.id)" icon>
                    <v-icon small> mdi-delete </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <template v-if="newPurposeResult">
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
                      label="Value"
                      v-model="newPurposeResult.value"
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
                          :value="formatDate(newPurposeResult.date)"
                          label="Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        locale="ru-Latn"
                        first-day-of-week="1"
                        v-model="newPurposeResult.date"
                        @input="menu = false"
                      />
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="createPurposeResult()"
                >Create</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import { HTTP } from "@/services/request";
import moment from "moment";

export default {
  name: "PurposeDetail",
  data: () => ({
    purpose: null,
    purposeResults: null,
    newPurposeResult: {},
    dialog: false,
  }),
  computed: {
    progress() {
      return (this.purpose.status * 100) / this.purpose.end_value;
    },
    pageURL() {
      return "purpose/" + this.$route.params.url + "/";
    },
  },
  methods: {
    getPurpose() {
      HTTP.get(this.pageURL).then((response) => {
        this.purpose = response.data;
      });
    },
    getPurposeResults() {
      HTTP.get(this.pageURL + "results/").then((response) => {
        this.purposeResults = response.data;
      });
    },
    createPurposeResult() {
      HTTP.post(this.pageURL + "results/", this.newPurposeResult).then(() => {
        this.initial();
      });
    },
    deletePurposeResult(resultId) {
      HTTP.delete(this.pageURL + "results/" + resultId + "/").then(() => {
        this.initial();
      });
    },
    openDialog() {
      this.initialNewPurposeResult();
      this.dialog = true;
    },
    initialNewPurposeResult() {
      this.newPurposeResult = {
        date: this.getToday(),
        value: "",
      };
    },
    initial() {
      this.getPurpose();
      this.getPurposeResults();
      this.initialNewPurposeResult();
      this.dialog = false;
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
  },
  created() {
    this.initial();
  },
};
</script>