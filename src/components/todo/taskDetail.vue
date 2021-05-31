<template>
  <v-card class="task-detail">
    <div class="task-header">
      <div class="task-title">
        <div class="task-complete">
          <v-icon v-if="!task.is_complete" dense @click="changeCompleteStatus">
            mdi-checkbox-blank-circle-outline
          </v-icon>
          <v-icon v-else dense @click="changeCompleteStatus">
            mdi-checkbox-marked-circle
          </v-icon>
        </div>

        <div class="task-name">
          <div v-if="isChangeTitle">
            <v-form @submit.prevent="renameTask">
              <v-text-field
                :rules="inputRules"
                counter="50"
                autofocus
                v-model.trim="task.title"
                append-icon="mdi-send"
                append-outer-icon="mdi-close"
                @click:append="renameTask"
                @click:append-outer="isChangeTitle = false"
                required
                dense
              />
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
          <v-chip v-bind="attrs" v-on="on" @click:close="resetDateTime">
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
          <v-chip v-bind="attrs" v-on="on" @click:close="resetTime">
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
            <v-icon>mdi-checkbox-marked-outline</v-icon>
            <div class="check-list-title">
              <div v-if="renameCheckList.id == checkList.id">
                <v-form @submit.prevent="editCheckList">
                  <v-text-field
                    :rules="inputRules"
                    counter="50"
                    autofocus
                    v-model.trim="renameCheckList.title"
                    append-icon="mdi-send"
                    append-outer-icon="mdi-close"
                    @click:append="editCheckList"
                    @click:append-outer="renameCheckList.id = 0"
                    dense
                    required
                  />
                </v-form>
              </div>
              <div v-else>
                <b>{{ checkList.title }}</b>
              </div>
            </div>
            <div class="check-list-editor">
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
            </div>
            <div class="check-list-item-title">
              <span v-if="renameItem.id == item.id">
                <v-form @submit.prevent="editItem">
                  <v-text-field
                    :rules="inputRules"
                    counter="50"
                    autofocus
                    v-model.trim="renameItem.title"
                    append-icon="mdi-send"
                    append-outer-icon="mdi-close"
                    @click:append="editItem"
                    @click:append-outer="renameItem.id = 0"
                    dense
                    required
                  />
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
                :rules="inputRules"
                counter="50"
                autofocus
                v-model.trim="newCheckListItem.title"
                append-icon="mdi-send"
                append-outer-icon="mdi-close"
                @click:append="createItem(checkList.id)"
                @click:append-outer="closeCreateItem"
                required
                dense
              />
            </v-form>
          </div>
          <div v-else>
            <v-btn text @click="openCreateItem(checkList.id)"> Добавить </v-btn>
          </div>
        </div>
        <v-form @submit.prevent="createNewCheckList" v-if="isCheckListCreate">
          <v-text-field
            :rules="inputRules"
            counter="50"
            autofocus
            v-model.trim="checkListTitle"
            append-icon="mdi-send"
            append-outer-icon="mdi-close"
            @click:append="createNewCheckList"
            @click:append-outer="isCheckListCreate = false"
            required
            dense
          />
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
    menuDate: false,
    menuTime: false,
    inputRules: [(v) => v.length <= 50 || "Текст слишком длинный"],
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
      "getTask",
      "getTaskCheckLists",
      "createCheckList",
      "createCheckListItem",
      "updateTask",
      "updateCheckList",
      "updateCheckListItem",
      "deleteTask",
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
    changeCompleteStatus() {
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
    editItem() {
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
  align-items: center;
}

.check-list {
  margin: 10px 0;
}

.check-list-title {
  width: 100%;
}

.check-list-editor {
  width: 60px;
}

.check-list-item {
  padding-left: 25px;
}

.check-list-item:hover {
  background-color: rgba(229, 239, 241, 1);
}

.check-list-item-title {
  width: 100%;
}

.check-list-item-action {
  width: 50px;
  visibility: hidden;
}

.check-list-item:hover .check-list-item-action {
  visibility: visible;
}
</style>
