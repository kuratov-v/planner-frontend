<template>
  <v-card class="task-detail">
    <div class="task-header">
      <div class="task-title">
        <div class="task-complete">
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
        </div>

        <div class="task-name">
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
            <span @click="isChangeTitle = true" class="headline">
              <span v-if="!task.is_complete">
                {{ task.title }}
              </span>
              <span v-else>
                <s>{{ task.title }}</s>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div class="task-menu">
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-btn text @click="isChangeTitle = !isChangeTitle">
                Переименовать
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn text @click="isChangeDescription = !isChangeDescription">
                Изменить описание
              </v-btn>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-btn text @click="deleteTask"> Удалить </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="task-datetime">
      <v-menu
        v-model="menuDate"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-chip
            v-bind="attrs"
            v-on="on"
            :close="task.date"
            @click:close="resetDateTime"
          >
            <v-icon> mdi-calendar-month-outline </v-icon>
            {{ task.date | moment("DD.MM.YYYY") }}
          </v-chip>
        </template>

        <v-date-picker
          locale="ru-Latn"
          first-day-of-week="1"
          v-model="task.date"
          @input="updateDate"
        />
      </v-menu>

      <v-menu
        v-model="menuTime"
        v-if="task.date"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-chip
            v-bind="attrs"
            v-on="on"
            :close="task.time"
            @click:close="resetTime"
          >
            <v-icon> mdi-clock-outline </v-icon>
            {{ task.time }}
          </v-chip>
        </template>
        <v-time-picker
          v-model="task.time"
          @input="updateTime"
          format="24hr"
        ></v-time-picker>
      </v-menu>
    </div>
    <div class="task-content">
      <b>Описание:</b>
      <div>
        <div v-if="isChangeDescription">
          <v-textarea
            autofocus
            auto-grow
            v-model.trim="task.description"
            required
            rows="5"
            outlined
          />
          <v-btn color="success" @click="changeDescription"> Сохранить </v-btn>
          <v-btn text @click="isChangeDescription = false"> Отмена </v-btn>
        </div>
        <div
          v-else
          class="task-description"
          @click="isChangeDescription = true"
        >
          {{ task.description }}
        </div>
      </div>
    </div>
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
    resetTime() {
      axios
        .patch(this.pageURL, {
          time: null,
        })
        .then(() => {
          this.$emit("getTasks");
          this.task.time = null;
        });
    },
  },
};
</script>

<style>
.task-detail {
  min-height: 700px;
}

.task-header {
  display: flex;
  align-items: center;
  padding: 15px;
  width: 100%;
  justify-content: space-between;
}

.task-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.task-name {
  width: 100%;
}

.task-content {
  padding: 5px 20px;
}

.task-complete {
  padding: 5px;
}

.task-datetime {
  padding: 0 0 15px 15px;
}

.task-description {
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
  min-height: 120px;
}
</style>