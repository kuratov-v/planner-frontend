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
            <v-list-item>
              <v-btn text @click="isCheckListCreate = !isCheckListCreate">
                Добавить чек-лист
              </v-btn>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-btn text @click="removeTask"> Удалить </v-btn>
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
      <div>
        <b>Описание:</b>
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

      <div v-if="taskCheckLists">
        <div
          class="check-list"
          v-for="checkList in taskCheckLists"
          :key="checkList.id"
        >
          <div class="width-content">
            <div>
              <span v-if="renameCheckList.id == checkList.id">
                <v-form @submit.prevent="editCheckList">
                  <v-text-field
                    autofocus
                    v-model="renameCheckList.title"
                    required
                  />
                  <v-btn text type="submit"> Сохранить </v-btn>
                  <v-btn text @click="renameCheckList.id = 0"> Отмена </v-btn>
                </v-form>
              </span>
              <span v-else>
                <v-icon>mdi-checkbox-marked-outline</v-icon>
                <b>{{ checkList.title }}</b>
              </span>
            </div>
            <div>
              <v-icon
                v-if="checkList.is_hide_complete"
                @click="changeHideCompleteStatus(checkList)"
                small
              >
                mdi-eye
              </v-icon>
              <v-icon v-else @click="changeHideCompleteStatus(checkList)" small>
                mdi-eye-off
              </v-icon>
              <v-icon @click="openRenameCheckList(checkList)" small>
                mdi-pencil
              </v-icon>
              <v-icon @click="removeCheckList(checkList.id)" small>
                mdi-delete
              </v-icon>
            </div>
          </div>
          <div
            class="width-content check-list-item"
            v-for="item in checkList.items"
            :key="item.id"
          >
            <div>
              <span>
                <v-icon
                  v-if="!item.is_complete"
                  dense
                  @click="updateItemStatus(item)"
                >
                  mdi-checkbox-blank-outline
                </v-icon>
                <v-icon v-else dense @click="updateItemStatus(item)">
                  mdi-checkbox-marked
                </v-icon>
              </span>
              <span v-if="renameItem.id == item.id">
                <v-form @submit.prevent="editItem(checkList.id)">
                  <v-text-field autofocus v-model="renameItem.title" required />
                  <v-btn text type="submit"> Добавить </v-btn>
                  <v-btn text @click="renameItem.id = 0"> Отмена </v-btn>
                </v-form>
              </span>
              <span v-else>
                {{ item.title }}
              </span>
            </div>

            <div class="check-list-item-action">
              <v-icon @click="openRenameItem(item)" small> mdi-pencil </v-icon>
              <v-icon @click="deleteItem(item.id)" small> mdi-delete </v-icon>
            </div>
          </div>
          <div v-if="newCheckListItem.checkList == checkList.id">
            <v-form @submit.prevent="createItem(checkList.id)">
              <v-text-field
                autofocus
                v-model="newCheckListItem.title"
                required
              />
              <v-btn text type="submit"> Добавить </v-btn>
              <v-btn text @click="closeCreateItem"> Отмена </v-btn>
            </v-form>
          </div>
          <div v-else>
            <v-btn text @click="openCreateItem(checkList.id)"> Добавить </v-btn>
          </div>
        </div>
        <v-form @submit.prevent="createNewCheckList" v-if="isCheckListCreate">
          <v-text-field autofocus v-model="checkListTitle" required />
          <v-btn color="success" type="submit"> Создать </v-btn>
          <v-btn text @click="isCheckListCreate = false"> Отмена </v-btn>
        </v-form>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "taskDetail",
  props: ["taskId"],
  data: () => ({
    isChangeTitle: false,
    isChangeDescription: false,
    isCheckListCreate: false,
    checkListTitle: "Чек-Лист",
    checkListRename: "",
    newCheckListItem: { checkList: 0, title: "" },
    renameItem: { id: 0, title: "" },
    renameCheckList: { id: 0, title: "" },
  }),
  created() {
    this.getTask(this.taskId);
    this.getTaskCheckLists(this.taskId);
  },
  watch: {
    taskId() {
      this.getTask(this.taskId);
      this.getTaskCheckLists(this.taskId);
    },
  },

  computed: {
    ...mapGetters(["task", "taskCheckLists"]),
  },
  methods: {
    ...mapActions([
      "updateTask",
      "deleteTask",
      "getTask",
      "getTaskCheckLists",
      "createCheckList",
      "createCheckListItem",
      "updateCheckListItem",
      "updateCheckList",
      "deleteCheckList",
      "deleteCheckListItem",
    ]),
    updateDate() {
      const taskId = this.task.id;
      const data = {
        date: this.task.date,
      };
      this.updateTask({ taskId, data });
    },
    updateTime() {
      const taskId = this.task.id;
      const data = {
        time: this.task.time,
      };
      this.updateTask({ taskId, data });
    },
    changeCompleteStatus(task) {
      const taskId = this.task.id;
      const data = {
        is_complete: !this.task.is_complete,
      };
      this.updateTask({ taskId, data });
    },
    changeDescription() {
      const taskId = this.task.id;
      const data = {
        description: this.task.description,
      };
      this.updateTask({ taskId, data });
      this.isChangeDescription = false;
    },
    renameTask() {
      const taskId = this.task.id;
      const data = {
        title: this.task.title,
      };
      this.updateTask({ taskId, data });
      this.isChangeTitle = false;
    },
    removeTask() {
      this.deleteTask(this.task.id);
      this.$emit("closeTaskDialog");
    },
    resetDateTime() {
      const taskId = this.task.id;
      const data = {
        date: null,
        time: null,
      };
      this.updateTask({ taskId, data });
    },
    resetTime() {
      const taskId = this.task.id;
      const data = {
        time: null,
      };
      this.updateTask({ taskId, data });
    },
    createNewCheckList() {
      const data = {
        title: this.checkListTitle,
        task: this.task.id,
      };
      this.createCheckList(data);
      this.checkListTitle = "Чек-Лист";
      this.isCheckListCreate = false;
    },
    updateItemStatus(item) {
      const itemId = item.id;
      const data = {
        is_complete: !item.is_complete,
      };
      this.updateCheckListItem({ itemId, data });
    },
    createItem() {
      const data = {
        check_list: this.newCheckListItem.checkList,
        title: this.newCheckListItem.title,
      };
      this.createCheckListItem(data);
      this.newCheckListItem.title = "";
    },
    removeCheckList(checkListId) {
      this.deleteCheckList(checkListId);
    },
    deleteItem(itemId) {
      this.deleteCheckListItem(itemId);
    },
    openRenameCheckList(checkList) {
      this.renameCheckList.id = checkList.id;
      this.renameCheckList.title = checkList.title;
    },
    editCheckList() {
      const checkListId = this.renameCheckList.id;
      const data = {
        title: this.renameCheckList.title,
      };
      this.updateCheckList({ checkListId, data });
      this.renameCheckList.id = 0;
    },
    openRenameItem(item) {
      this.renameItem.id = item.id;
      this.renameItem.title = item.title;
    },
    editItem(checkListId) {
      const itemId = this.renameItem.id;
      const data = {
        title: this.renameItem.title,
      };
      this.updateCheckListItem({ itemId, data });
      this.renameItem.id = 0;
    },
    changeHideCompleteStatus(checkList) {
      const checkListId = checkList.id;
      const data = {
        is_hide_complete: !checkList.is_hide_complete,
      };
      this.updateCheckList({ checkListId, data });
    },
    openCreateItem(checkListId) {
      this.newCheckListItem.checkList = checkListId;
    },
    closeCreateItem() {
      this.newCheckListItem.title = "";
      this.newCheckListItem.checkList = 0;
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
  white-space: pre-wrap;
}

.width-content {
  display: flex;
  justify-content: space-between;
}

.check-list {
  margin: 10px 0;
}

.check-list-item {
  padding-left: 25px;
}

.check-list-item:hover {
  background-color: rgba(229, 239, 241, 1);
}

.check-list-item-action {
  visibility: hidden;
}

.check-list-item:hover .check-list-item-action {
  visibility: visible;
}
</style>