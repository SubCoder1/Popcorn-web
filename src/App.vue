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
  color: rgb(228, 77, 60);
}

::selection {
  color: white;
  background: rgb(241, 133, 121);
}

::-moz-selection {
  color: white;
  background: rgb(241, 133, 121);
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.form-control {
  background-color: rgba(243, 246, 248, 1);
  border-color: rgba(217, 224, 230, 1);
  padding: 0.75rem;
  border: 2px solid #efefef;
}

.form-control:focus {
  border: 2px solid rgb(241, 133, 121);
  box-shadow: none;
  background-color: rgba(243, 246, 248, 1);
}

.form-errors {
  height: 50px;
  color: rgb(241, 133, 121);
}

.show-error {
  background-color: rgba(255, 220, 227, 1);
  color: rgb(250, 71, 51);
}

.btn {
  background-color: rgb(241, 133, 121);
  color: white;
  padding: 0.75rem;
}

.btn:hover,
.btn:focus {
  color: white;
  background-color: rgb(228, 77, 60);
  box-shadow: none;
  outline: none;
}
</style>
