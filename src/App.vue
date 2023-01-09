<!-- Root file of Popcorn-web which defines the root template with top-level routing of this Vue application -->

<template>
  <router-view />
</template>

<style lang="css">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap");

html,
body {
  height: 100%;
  background-color: rgb(248 246 243);
}

#app {
  font-family: "Roboto Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(32 39 44 1);
  height: 100%;
}

a {
  text-decoration: none;
  font-size: 0.875rem;
  color: rgb(241, 133, 121);
}

a:hover {
  color: rgb(250, 71, 51);
}
</style>
