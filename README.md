# Frontend for pet-project [planner-dev.ru](https://planner-dev.ru/)
<img src="https://img.shields.io/github/workflow/status/kuratov-v/planner-frontend/Deploy/master?style=plastic"> <img src="https://img.shields.io/github/last-commit/kuratov-v/planner-frontend?style=plastic">

 Frontend is built on vue.js, see [backend repo](https://github.com/kuratov-v/planner-backend).

## Project configuration
Create a [vk app](https://vk.com/editapp?act=create) for user auth with the following settings.

```
Адрес сайта: http://localhost:8080/
Базовый домен: localhost
Доверенный редирект URI: http://localhost:8080/auth/vk/success/
```
Then create `.env.local` with vk application id ("ID приложения"), for example see `.env_example` and run serve.
```
npm install
npm run serve
```
