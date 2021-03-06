<template>
  <div id="todo-project-detail">
    <div class="project-header pa-3">
      <div class="project-title">
        <div v-if="isChangeProjectTitle">
          <v-form @submit.prevent="renameProject">
            <v-text-field
              :rules="inputRules"
              counter="50"
              autofocus
              v-model.trim="project.title"
              append-icon="mdi-send"
              append-outer-icon="mdi-close"
              @click:append="renameProject"
              @click:append-outer="isChangeProjectTitle = false"
              required
            />
          </v-form>
        </div>
        <div v-else>
          <h1>{{ project.title }}</h1>
        </div>
      </div>
      <div>
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-btn text @click="isChangeProjectTitle = !isChangeProjectTitle">
                Переименовать
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn text @click="changeHideCompleteStatus">
                <span v-if="project.is_hide_complete">
                  Показывать выполненные
                </span>
                <span v-else> Скрывать выполненные </span>
              </v-btn>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-btn text @click="removeProject"> Удалить </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="section-list">
      <div
        class="section droppable"
        v-for="section in sections"
        :key="section.id"
        @drop="onDrop($event, section.id)"
        @dragover.prevent
        @dragenter.prevent
      >
        <v-row dense align="center" justify="center">
          <v-col cols="10">
            <div v-if="editedSection.id == section.id">
              <v-form @submit.prevent="renameSection">
                <v-text-field
                  :rules="inputRules"
                  counter="50"
                  autofocus
                  v-model.trim="editedSection.title"
                  append-icon="mdi-send"
                  append-outer-icon="mdi-close"
                  @click:append="renameSection"
                  @click:append-outer="editedSection.id = 0"
                  required
                  dense
                />
              </v-form>
            </div>
            <div v-else>
              <b>{{ section.title }}</b>
            </div>
          </v-col>
          <v-col cols="1">
            <v-menu bottom left offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-btn text @click="startRenameSection(section)">
                    Переименовать
                  </v-btn>
                </v-list-item>
                <v-divider />
                <v-list-item>
                  <v-btn text @click="deleteSection(section.id)">
                    Удалить
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-divider />

        <div
          v-for="task in projectTasks.filter(
            (task) => task.section === section.id
          )"
          :key="task.id"
          @dragstart="onDragStart($event, task)"
          class="draggable task"
          draggable="true"
        >
          <v-row dense>
            <v-col cols="1">
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
            </v-col>
            <v-col cols="11" @click="openTaskDialog(task)">
              <div>
                <span v-if="!task.is_complete">
                  {{ task.title }}
                </span>
                <span v-else>
                  <s>{{ task.title }}</s>
                </span>
              </div>
              <div class="inline">
                <div v-if="task.description">
                  <v-icon dense>mdi-text</v-icon>
                </div>
                <div v-if="task.check_list">
                  <v-icon dense>mdi-checkbox-marked-outline</v-icon>
                  <span class="sub-text">{{ task.check_list }}</span>
                </div>
              </div>
              <div v-if="task.date" class="sub-text text-right">
                <span
                  v-bind:class="{
                    'task-expired': isTaskExpired(task),
                  }"
                >
                  <span v-if="task.time">
                    {{ task.time }}
                  </span>
                  <span v-if="task.date">
                    {{ getTaskDate(task) }}
                  </span>
                </span>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="new-task pa-2">
          <div v-if="section.id == newTask.section">
            <v-form @submit.prevent="createNewTask">
              <v-text-field
                :rules="inputRules"
                counter="50"
                autofocus
                v-model="newTask.name"
                append-icon="mdi-send"
                append-outer-icon="mdi-close"
                @click:append="createNewTask"
                @click:append-outer="closeNewTaskNameForm"
                required
                dense
              />
            </v-form>
          </div>
          <v-btn v-else text block @click="openNewTaskNameForm(section.id)">
            <v-icon> mdi-plus-circle-outline </v-icon>
            Добавить задачу
          </v-btn>
        </div>
      </div>
      <div class="section pa-2">
        <v-form @submit.prevent="createNewSection">
          <v-text-field
            :rules="inputRules"
            counter="50"
            label="Название секции"
            v-model="newSection"
            append-icon="mdi-send"
            @click:append="createNewSection"
            required
            solo
            dense
          />
        </v-form>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog v-model="taskDialog" max-width="750px">
        <taskDetail
          :taskId="taskDetail.id"
          @closeTaskDialog="closeTaskDialog"
        />
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import taskDetail from "@/components/todo/taskDetail";
import { mapActions, mapGetters } from "vuex";
import { getStringDate } from "@/services/utils";

export default {
  name: "TodoProjectDetail",
  components: {
    taskDetail,
  },
  data: () => ({
    newSection: "",
    newTask: { name: "", section: 0 },
    taskDialog: false,
    taskDetail: {},
    editedSection: { id: 0, title: "" },
    isChangeProjectTitle: false,
    inputRules: [(v) => v.length <= 50 || "Текст слишком длинный"],
  }),
  computed: {
    ...mapGetters(["project", "sections", "projectTasks"]),
  },
  mounted() {
    this.getProject(this.$route.params.id);
    this.getProjectSections(this.$route.params.id);
    this.getProjectTasks(this.$route.params.id);
  },
  methods: {
    ...mapActions([
      "getProject",
      "getProjectSections",
      "getProjectTasks",
      "createSection",
      "createTask",
      "updateTask",
      "updateSection",
      "updateProject",
      "deleteSection",
      "deleteProject",
    ]),
    onDragStart(e, task) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("taskId", task.id.toString());
    },
    onDrop(e, section) {
      const taskId = parseInt(e.dataTransfer.getData("taskId"));
      this.updateTaskSection(taskId, section);
    },
    createNewSection() {
      const data = {
        title: this.newSection,
        project: this.$route.params.id,
      };
      this.createSection(data);
      this.newSection = "";
    },
    changeHideCompleteStatus() {
      const projectId = this.$route.params.id;
      const data = {
        is_hide_complete: !this.project.is_hide_complete,
      };
      this.updateProject({ projectId, data });
    },
    startRenameSection(section) {
      this.editedSection.id = section.id;
      this.editedSection.title = section.title;
    },
    renameSection() {
      const sectionId = this.editedSection.id;
      const data = {
        title: this.editedSection.title,
      };
      this.updateSection({ sectionId, data });
      this.editedSection.id = 0;
    },
    updateTaskSection(taskId, sectionId) {
      const data = {
        section: sectionId,
      };
      this.updateTask({ taskId, data });
    },
    changeCompleteStatus(task) {
      const data = {
        is_complete: !task.is_complete,
      };
      const taskId = task.id;
      this.updateTask({ taskId, data });
    },
    openNewTaskNameForm(sectionId) {
      this.newTask.section = sectionId;
    },
    closeNewTaskNameForm() {
      this.newTask.section = 0;
      this.newTask.name = "";
    },
    createNewTask() {
      const data = {
        title: this.newTask.name,
        section: this.newTask.section,
      };
      this.createTask(data);
      this.newTask.name = "";
    },
    renameProject() {
      const projectId = this.$route.params.id;
      const data = {
        title: this.project.title,
      };
      this.updateProject({ projectId, data });
      this.isChangeProjectTitle = false;
    },
    removeProject() {
      this.deleteProject(this.$route.params.id);
      this.$router.push({ name: "TodoProjects" });
    },
    openTaskDialog(task) {
      this.taskDialog = true;
      this.taskDetail = task;
    },
    closeTaskDialog() {
      this.taskDialog = false;
      this.taskDetail = {};
    },
    getTaskDate(task) {
      return getStringDate(task.date);
    },
    isTaskExpired(task) {
      if (task.is_complete) return false;
      const date = task.date,
        time = task.time;
      var taskDate = new Date(date);
      if (time) {
        var today = Date.now();
        taskDate.setHours(time.slice(0, 2), time.slice(3, 5), 0, 0);
      } else {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
      }
      return today > taskDate;
    },
  },
};
</script>

<style>
#todo-project-detail {
  margin: -1%;
  height: 100%;
  position: relative;
}

.project-header {
  width: 100%;
  height: 60px;
  justify-content: space-between;
  display: flex;
  align-items: center;
}

.project-title {
  width: 100%;
}

.section-list {
  position: absolute;
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
}

.section {
  width: 300px;
  max-height: 97%;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 5px;
  padding-top: 5px;
  display: inline-block;
  border: 1px solid gray;
  background-color: rgb(237, 237, 250);
  border-radius: 5px;
  vertical-align: top;
}

.task {
  border: 1px solid lightgray;
  border-radius: 5px;
  background-color: white;
  box-shadow: 1px 3px 3px 0px rgba(0, 0, 0, 0.1);
  margin: 5px;
  padding: 5px;
  white-space: normal;
  overflow-x: hidden;
}

.task:hover {
  cursor: pointer;
}

.sub-text {
  color: gray;
  font-size: 90%;
  width: 100%;
}

.sub-text span {
  padding: 0 3px;
}

.inline {
  white-space: nowrap;
}

.inline div {
  display: inline-block;
  margin-right: 5px;
}

.task-expired {
  border-radius: 5px;
  color: rgba(255, 0, 0, 0.7);
  border: 2px solid rgba(255, 0, 0, 0.3);
}
</style>
