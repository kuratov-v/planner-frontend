<template>
  <div>
    <h1>Purpose List</h1>
    <v-btn outlined @click="openDialog()"> Create purpose </v-btn>
    <h3>Current</h3>
    <v-row>
      <v-col v-for="purpose in currentPurposes" :key="purpose.id">
        <v-card max-width="300" outlined>
          <v-card-title>
            {{ purpose.name }}
          </v-card-title>
          <v-card-text class="text--primary">
            <div>
              <b>Цель: </b>
              {{ purpose.end_value }}
              <br />
              <b>Результат: </b>
              {{ purpose.status }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="pushPurposeDetail(purpose.id)">
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <h3>Archived</h3>
    <v-row>
      <v-col v-for="purpose in archivedPurposes" :key="purpose.id">
        <v-card max-width="300" outlined>
          <v-card-title>
            {{ purpose.name }}
          </v-card-title>
          <v-card-actions>
            <v-btn text @click="pushPurposeDetail(purpose.id)">
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <template v-if="newPurposeData">
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
                      v-model="newPurposeData.name"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Description"
                      v-model="newPurposeData.description"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <v-text-field
                      label="End value"
                      v-model="newPurposeData.end_value"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
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
                          :value="formatDate(newPurposeData.end_date)"
                          label="Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        locale="ru-Latn"
                        first-day-of-week="1"
                        v-model="newPurposeData.end_date"
                        @input="menu = false"
                      />
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="newPurposeData.mode"
                      :items="purposeModeList"
                      item-value="id"
                      item-text="value"
                      :menu-props="{ maxHeight: '400' }"
                      label="Mode"
                      persistent-hint
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-switch
                      v-model="newPurposeData.invert_value"
                      label="Invert value"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="createPurpose()"
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
import axios from "axios";
import moment from "moment";

export default {
  name: "PurposeList",
  data: () => ({
    purposes: [],
    dialog: false,
    newPurposeData: null,
    purposeModeList: [],
  }),
  computed: {
    currentPurposes() {
      return this.purposes.filter((p) => !p.is_complete);
    },
    archivedPurposes() {
      return this.purposes.filter((p) => p.is_complete);
    },
  },
  methods: {
    getPurposes() {
      const token = localStorage.getItem("auth");
      axios
        .get(this.$store.state.serverDomain + "api/v1/purpose/", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.purposes = response.data;
        });
    },
    createPurpose() {
      const token = localStorage.getItem("auth");
      axios
        .post(
          this.$store.state.serverDomain + "api/v1/purpose/",
          this.newPurposeData,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          this.initial();
        });
    },
    pushPurposeDetail(url) {
      this.$router.push({ name: "PurposeDetail", params: { url: url } });
    },
    openDialog() {
      this.initialNewPurposeData();
      this.dialog = true;
    },
    initialNewPurposeData() {
      this.newPurposeData = {
        name: "",
        description: "",
        end_value: "",
        end_date: this.getLastDayOfMonth(),
        mode: "",
        invert_value: false,
      };
    },
    initial() {
      this.getPurposes();
      this.initialNewPurposeData();
      this.dialog = false;
      this.purposeModeList = [
        { id: "sum", value: "Суммарное значение" },
        { id: "avg", value: "Среднее значение" },
        { id: "max", value: "Максимальное значение" },
      ];
    },
    formatDate(date) {
      return moment(String(date)).format("DD.MM.YYYY");
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
    this.initial();
  },
};
</script>
