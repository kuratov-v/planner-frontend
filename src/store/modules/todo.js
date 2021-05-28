import axios from "@/services/request";

export default {
    state: {
        sections: [],
        projects: [],
        project: {},
        tasks: [],
        task: {},
        taskCheckLists: [],
    },

    actions: {
        getTask(ctx, taskId) {
            axios.get(`todo/tasks/${taskId}/`).then((response) => {
                ctx.commit("updateTask", response.data);
            });
        },
        getProject(ctx, projectId) {
            axios.get(`todo/projects/${projectId}/`).then((response) => {
                ctx.commit("updateProject", response.data);
            });
        },
        getProjects(ctx) {
            axios.get("todo/projects/").then((response) => {
                ctx.commit("updateProjects", response.data);
            });
        },
        getTaskCheckLists(ctx, taskId) {
            axios.get(`/todo/tasks/${taskId}/check-list/`).then((response) => {
                ctx.commit("updateTaskCheckLists", response.data);
            });
        },
        createProject(ctx, data) {
            axios.post("todo/projects/", data).then(() => {
                ctx.dispatch("getProjects")
            });
        },
        createCheckList(ctx, data) {
            axios.post("todo/check-lists/", data).then(() => {
                ctx.dispatch("getTaskCheckLists", data.task)
            });
        },
        createCheckListItem(ctx, data) {
            axios.post("todo/items/", data).then(() => {
                ctx.dispatch("getTaskCheckLists", ctx.getters.task.id)
            });
        },
        updateCheckList(ctx, { checkListId, data }) {
            axios.patch(`todo/check-lists/${checkListId}/`, data).then(() => {
                ctx.dispatch("getTaskCheckLists", ctx.getters.task.id)
            });
        },
        updateCheckListItem(ctx, { itemId, data }) {
            axios.patch(`todo/items/${itemId}/`, data).then(() => {
                ctx.dispatch("getTaskCheckLists", ctx.getters.task.id)
            });
        },
        updateProject(ctx, { projectId, data }) {
            axios.patch(`todo/projects/${projectId}/`, data).then(() => {
                ctx.dispatch("getProject", projectId)
            });
        },
        deleteCheckList(ctx, checkListId) {
            axios.delete(`todo/check-lists/${checkListId}/`).then(() => {
                ctx.dispatch("getTaskCheckLists", ctx.getters.task.id)
            });
        },
        deleteCheckListItem(ctx, itemId) {
            axios.delete(`todo/items/${itemId}/`).then(() => {
                ctx.dispatch("getTaskCheckLists", ctx.getters.task.id)
            });
        },
        deleteProject(ctx, projectId) {
            axios.delete(`todo/projects/${projectId}/`).then(() => {
                ctx.dispatch("getProjects")
            });
        },
        getProjectSections(ctx, projectId) {
            axios.get(`todo/projects/${projectId}/sections/`).then((response) => {
                ctx.commit("updateSections", response.data);
            });
        },
        getProjectTasks(ctx, projectId) {
            axios.get(`todo/projects/${projectId}/tasks/`).then((response) => {
                ctx.commit("updateTasks", response.data);
            });
        },
        createSection(ctx, data) {
            axios.post(`todo/sections/`, data).then(() => {
                ctx.dispatch("getProjectSections", ctx.getters.project.id)
            });
        },
        createTask(ctx, data) {
            axios.post("todo/tasks/", data).then(() => {
                ctx.dispatch("getProjectTasks", ctx.getters.project.id)
            });
        },
        updateTask(ctx, { taskId, data }) {
            axios.patch(`todo/tasks/${taskId}/`, data).then(() => {
                ctx.dispatch("getProjectTasks", ctx.getters.project.id)
                ctx.dispatch("getTask", taskId)
            });
        },
        updateSection(ctx, { sectionId, data }) {
            axios.patch(`todo/sections/${sectionId}/`, data).then(() => {
                ctx.dispatch("getProjectSections", ctx.getters.project.id)
            });
        },
        deleteTask(ctx, taskId) {
            axios.delete(`todo/tasks/${taskId}/`).then(() => {
                ctx.dispatch("getProjectTasks", ctx.getters.project.id)
            });
        },
        deleteSection(ctx, sectionId) {
            axios.delete(`todo/sections/${sectionId}/`).then(() => {
                ctx.dispatch("getProjectSections", ctx.getters.project.id)
            });
        },
    },

    mutations: {
        updateProject(state, project) {
            state.project = project;
        },
        updateProjects(state, projects) {
            state.projects = projects;
        },
        updateTasks(state, tasks) {
            state.tasks = tasks;
        },
        updateTask(state, task) {
            state.task = task;
        },
        updateSections(state, sections) {
            state.sections = sections;
        },
        updateTaskCheckLists(state, checkLists) {
            state.taskCheckLists = checkLists;
        },
    },

    getters: {
        projects(state) {
            return state.projects
        },
        project(state) {
            return state.project
        },
        tasks(state) {
            if (state.project.is_hide_complete)
                return state.tasks.filter((task) => !task.is_complete)
            return state.tasks
        },
        sections(state) {
            return state.sections
        },
        task(state) {
            return state.task
        },
        taskCheckLists(state) {
            return state.taskCheckLists
        },
    },
}