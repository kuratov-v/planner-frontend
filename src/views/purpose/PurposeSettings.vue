<template>
  <div>
    <h2>Settings</h2>
    <v-text-field label="Name" v-model="purpose.name" required></v-text-field>
    <v-text-field
      label="Description"
      v-model="purpose.description"
    ></v-text-field>
    <v-text-field
      label="End value"
      v-model="purpose.end_value"
      required
    ></v-text-field>
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
          v-model="purpose.end_date"
          label="Date"
          readonly
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <v-date-picker
        locale="ru-Latn"
        first-day-of-week="1"
        v-model="purpose.end_date"
        @input="menu = false"
      />
    </v-menu>
    <v-select
      v-model="purpose.mode"
      :items="purposeModeList"
      item-value="id"
      item-text="value"
      :menu-props="{ maxHeight: '400' }"
      label="Mode"
      persistent-hint
    ></v-select>
    <v-select
      v-model="purpose.group_result_by"
      :items="resultGroupBy"
      item-value="id"
      item-text="value"
      :menu-props="{ maxHeight: '400' }"
      label="Group by"
      persistent-hint
    ></v-select>
    <v-select
      v-model="purpose.group_result_mode"
      :items="resultModeList"
      item-value="id"
      item-text="value"
      :menu-props="{ maxHeight: '400' }"
      label="Result mode"
      persistent-hint
    ></v-select>
    <v-switch v-model="purpose.invert_value" label="Invert value"></v-switch>
    <v-switch v-model="purpose.is_complete" label="Complete"></v-switch>
    <v-btn @click="editPurpose" outlined>Save</v-btn>
    <v-btn text color="red" @click="deletePurpose"> Удалить </v-btn>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PurposeSettings",
  data: () => ({
    purpose: {},
    purposeModeList: [
      { id: "sum", value: "Суммарное значение" },
      { id: "avg", value: "Среднее значение" },
      { id: "max", value: "Максимальное значение" },
    ],
    resultModeList: [
      { id: "sum", value: "Суммарное значение" },
      { id: "avg", value: "Среднее значение" },
      { id: "max", value: "Максимальное значение" },
      { id: "min", value: "Минимальное значение" },
    ],
    resultGroupBy: [
      { id: null, value: "Не группировать" },
      { id: "day", value: "Day" },
      { id: "week", value: "Week" },
      { id: "month", value: "Month" },
    ],
  }),
  methods: {
    getPurpose() {
      const token = localStorage.getItem("auth");
      var purposeId = this.$route.params.url + "/";
      axios
        .get(this.$store.state.serverDomain + "api/v1/purpose/" + purposeId, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.purpose = response.data;
        });
    },
    editPurpose() {
      const token = localStorage.getItem("auth");
      var purposeId = this.$route.params.url + "/";
      axios
        .patch(
          this.$store.state.serverDomain + "api/v1/purpose/" + purposeId,
          this.purpose,
          { headers: { Authorization: "Bearer " + token } }
        )
        .then(() => {
          this.$router.push({
            name: "PurposeDetail",
            params: { url: this.purpose.id },
          });
        });
    },
    deletePurpose() {
      const token = localStorage.getItem("auth");
      var purposeId = this.$route.params.url + "/";
      axios
        .delete(
          this.$store.state.serverDomain + "api/v1/purpose/" + purposeId,
          { headers: { Authorization: "Bearer " + token } }
        )
        .then(() => {
          this.$router.push({ name: "PurposeList" });
        });
    },
  },
  created() {
    this.getPurpose();
  },
};
</script>