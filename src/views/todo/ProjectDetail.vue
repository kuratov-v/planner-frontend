<template>
  <div>
    <v-row>
      <v-col cols="11">
        <div v-if="isChangeProjectTitle">
          <v-form @submit.prevent="renameProject">
            <v-text-field
              autofocus
              v-model.trim="project.title"
              required
            ></v-text-field>
            <v-btn color="success" type="submit"> Сохранить </v-btn>
            <v-btn text @click="isChangeProjectTitle = false"> Отмена </v-btn>
          </v-form>
        </div>
        <div v-else>
          <h1>{{ project.title }}</h1>
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
              <v-btn text @click="isChangeProjectTitle = true">
                Переименовать
              </v-btn>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-btn text @click="deleteProject"> Удалить </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

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
                  autofocus
                  v-model.trim="editedSection.title"
                  required
                  solo
                ></v-text-field>
                <v-btn color="success" type="submit"> save </v-btn>
                <v-btn text @click="editedSection.id = 0"> Отмена </v-btn>
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
          v-for="task in tasks.filter((x) => x.section === section.id)"
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
              <div v-if="task.description">
                <v-icon dense>mdi-text</v-icon>
              </div>
              <div v-if="task.date" class="sub-text text-right">
                <span>
                  {{ task.time }}
                </span>
                <span>
                  {{ task.date | moment("DD.MM.YY") }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="new-task">
          <div v-if="section.id == newTask.section">
            <v-form @submit.prevent="createTask">
              <v-text-field
                label="Новая задача"
                v-model="newTask.name"
                required
                solo
                autofocus
                dense
              />
              <v-btn outlined type="submit"> Создать </v-btn>
              <v-btn text @click="closeNewTaskNameForm"> Отмена </v-btn>
            </v-form>
          </div>
          <v-btn v-else text block @click="openNewTaskNameForm(section.id)">
            <v-icon> mdi-plus-circle-outline </v-icon>
            Добавить задачу
          </v-btn>
        </div>
      </div>
      <div class="section">
        <v-form @submit.prevent="createSection">
          <v-text-field
            label="Название секции"
            v-model="newSection"
            required
            solo
          />
          <v-btn outlined type="submit"> Создать </v-btn>
        </v-form>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog v-model="taskDialog" max-width="750px">
        <taskDetail
          :task="taskDetail"
          @getTasks="getTasks"
          @closeTaskDialog="closeTaskDialog"
        />
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from "@/services/request";
import taskDetail from "@/components/todo/taskDetail";

export default {
  name: "TodoProjectDetail",
  components: {
    taskDetail,
  },
  data: () => ({
    project: Object,
    sections: Array,
    tasks: Array,
    newSection: "",
    newTask: { name: "", section: 0 },
    taskDialog: false,
    taskDetail: {},
    editedSection: { id: 0, title: "" },
    isChangeProjectTitle: false,
  }),
  computed: {
    pageURL() {
      return "todo/projects/" + this.$route.params.id + "/";
    },
  },
  methods: {
    onDragStart(e, task) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("taskId", task.id.toString());
    },
    onDrop(e, section) {
      const taskId = parseInt(e.dataTransfer.getData("taskId"));
      this.updateTaskSection(taskId, section);
    },
    getProject() {
      axios.get(this.pageURL).then((response) => {
        this.project = response.data;
      });
    },
    getSections() {
      axios.get(this.pageURL + "sections/").then((response) => {
        this.sections = response.data;
      });
    },
    deleteSection(sectionId) {
      axios.delete(this.pageURL + "sections/" + sectionId + "/").then(() => {
        this.getSections();
      });
    },
    getTasks() {
      axios.get(this.pageURL + "tasks/").then((response) => {
        this.tasks = response.data;
      });
    },
    createSection() {
      const data = {
        title: this.newSection,
        project: this.$route.params.id,
      };
      axios.post(this.pageURL + "sections/", data).then(() => {
        this.newSection = "";
        this.getSections();
      });
    },
    startRenameSection(section) {
      this.editedSection.id = section.id;
      this.editedSection.title = section.title;
    },
    renameSection() {
      axios
        .patch(this.pageURL + "sections/" + this.editedSection.id + "/", {
          title: this.editedSection.title,
        })
        .then(() => {
          this.editedSection.id = 0;
          this.getSections();
        });
    },
    updateTaskSection(taskId, sectionId) {
      const data = {
        section: sectionId,
      };
      axios.patch("todo/tasks/" + taskId + "/", data).then(() => {
        this.getTasks();
      });
    },
    changeCompleteStatus(task) {
      const data = {
        is_complete: !task.is_complete,
      };
      axios.patch("todo/tasks/" + task.id + "/", data).then(() => {
        this.getTasks();
      });
    },
    openNewTaskNameForm(sectionId) {
      this.newTask.section = sectionId;
    },
    closeNewTaskNameForm() {
      this.newTask.section = 0;
      this.newTask.name = "";
    },
    createTask() {
      const data = {
        title: this.newTask.name,
        section: this.newTask.section,
      };
      axios.post("todo/tasks/", data).then(() => {
        this.newTask.name = "";
        this.newTask.section = 0;
        this.getTasks();
      });
    },
    renameProject() {
      axios
        .patch(this.pageURL, {
          title: this.project.title,
        })
        .then(() => {
          this.isChangeProjectTitle = false;
        });
    },
    deleteProject() {
      axios.delete(this.pageURL).then(() => {
        this.$router.push({ name: "TodoProjects" });
      });
    },
    openTaskDialog(task) {
      this.taskDialog = true;
      this.taskDetail = task;
    },
    closeTaskDialog() {
      this.taskDialog = false;
      this.taskDetail = {};
    },
  },
  created() {
    this.getProject();
    this.getSections();
    this.getTasks();
  },
};
</script>

<style>
.section-list {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.section {
  width: 300px;
  margin: 5px;
  padding: 5px;
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
  padding-right: 10px;
}
</style>