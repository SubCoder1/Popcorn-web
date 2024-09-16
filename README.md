# Popcorn-Web <img src=https://github.com/SubCoder1/Popcorn/assets/40127554/f2c453a0-1096-45f2-99ac-532a183aca9c width="80">
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Popcorn-web is an application powered by Vue-js which serves as a frontend for [Popcorn](https://github.com/SubCoder1/Popcorn).

You can check Popcorn out in production at https://popcorntv.in

# Requirements

**Node** <20 or above>

**NPM** <9 or above>

**VueJS** <3 or above>

# Building

Make sure that you've `npm`, `node` and `VueJS` installed in your system. You can run this project using the command below :-

This step is only required if Popcorn-Web is running without Docker.
1. Set ```VUE_APP_SERVER_URL = http://localhost:<server-port>``` in Popcorn-web/.env (line-1).
2. Execute the following commands :-
```console
npm install .
npm run serve -- --port 8081
# visit localhost:8081 to check it out!
```
