<template>
  <v-card class="task-detail">
    <v-card-title>
      <v-icon
        v-if="!task.is_complete"
        dense
        @click="changeCompleteStatus(task)"
      >
        mdi-checkbox-blank-circle-outline
      </v-icon>
      <v-icon v-else dense @click="changeCompleteStatus(task)">
        mdi-checkbox-marked-circle
      </v-icon>
      <div v-if="isChangeTitle">
        <v-form @submit.prevent="renameTask">
          <v-text-field
            autofocus
            v-model.trim="task.title"
            required
          ></v-text-field>
          <v-btn color="success" type="submit"> Сохранить </v-btn>
          <v-btn text @click="isChangeTitle = false"> Отмена </v-btn>
        </v-form>
      </div>
      <div v-else>
        <span class="headline">{{ task.title }}</span>
        <v-btn @click="isChangeTitle = true" icon>
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn @click="deleteTask" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <div>
      <div v-if="isChangeDescription">
        <b>Описание:</b>
        <v-textarea
          label="Добавьте описание"
          autofocus
          v-model.trim="task.description"
          required
          rows="3"
        />
        <v-btn color="success" @click="changeDescription"> Сохранить </v-btn>
        <v-btn text @click="isChangeDescription = false"> Отмена </v-btn>
      </div>
      <div v-else>
        <b>Описание:</b>
        <v-btn @click="isChangeDescription = true" icon>
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <br />
        {{ task.description }}
      </div>
    </div>

    <div>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on"> mdi-calendar-month-outline </v-icon>
        </template>
        <v-date-picker
          locale="ru-Latn"
          first-day-of-week="1"
          v-model="task.date"
          @input="updateDate"
        />
      </v-menu>
      {{ task.date }}

      <br />

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on"> mdi-clock-outline </v-icon>
        </template>
        <v-time-picker
          v-model="task.time"
          @input="updateTime"
          format="24hr"
        ></v-time-picker>
      </v-menu>
      {{ task.time }}
    </div>
    <v-btn text @click="resetDateTime"> Reset datetime </v-btn>
  </v-card>
</template>

<script>
import axios from "@/services/request";

export default {
  name: "taskDetail",
  props: ["task"],
  data: () => ({
    isChangeTitle: false,
    isChangeDescription: false,
    task: {},
  }),
  computed: {
    pageURL() {
      return "todo/tasks/" + this.task.id + "/";
    },
  },
  methods: {
    updateDate() {
      axios
        .patch(this.pageURL, {
          date: this.task.date,
        })
        .then(() => {
          this.$emit("getTasks");
        });
    },
    updateTime() {
      axios
        .patch(this.pageURL, {
          time: this.task.time,
        })
        .then(() => {
          this.$emit("getTasks");
        });
    },
    changeCompleteStatus(task) {
      this.task.is_complete = !task.is_complete;
      axios
        .patch("todo/tasks/" + task.id + "/", {
          is_complete: this.task.is_complete,
        })
        .then(() => {
          this.$emit("getTasks");
        });
    },
    changeDescription() {
      axios
        .patch(this.pageURL, {
          description: this.task.description,
        })
        .then(() => {
          this.$emit("getTasks");
          this.isChangeDescription = false;
        });
    },
    renameTask() {
      axios
        .patch(this.pageURL, {
          title: this.task.title,
        })
        .then(() => {
          this.$emit("getTasks");
          this.isChangeTitle = false;
        });
    },
    deleteTask() {
      axios.delete(this.pageURL).then(() => {
        this.$emit("getTasks");
        this.$emit("closeTaskDialog");
      });
    },
    resetDateTime() {
      axios
        .patch(this.pageURL, {
          date: null,
          time: null,
        })
        .then(() => {
          this.$emit("getTasks");
          this.task.date = this.task.time = null;
        });
    },
  },
};
</script>

<style>
.task-detail {
  min-height: 700px;
}
</style>