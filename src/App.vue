<!-- Root file of Popcorn-web which defines the root template with top-level routing of this Vue application -->

<template>
  <router-view />
</template>

<style lang="css">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap");

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

.container-style {
  background: white;
  border-radius: 0.5rem;
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
  height: 65px;
  color: rgb(241, 133, 121);
  padding: 0.75rem;
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

.loader-1 {
  height: 20px;
  width: 20px;
  left: 33%;
  transform: translate(-30%, 0);
  -webkit-animation: loader-entry 0.3s forwards, loader-1-1 4.8s linear infinite;
  animation: loader-entry 0.3s forwards, loader-1-1 4.8s linear infinite;
}

@-webkit-keyframes loader-entry {
  0% {
    left: 33%;
  }
  100% {
    left: 30%;
  }
}

@keyframes loader-entry {
  0% {
    left: 33%;
  }
  100% {
    left: 30%;
  }
}

@-webkit-keyframes loader-1-1 {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes loader-1-1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-1 span {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: 20px;
  width: 20px;
  clip: rect(0, 20px, 20px, 10px);
  -webkit-animation: loader-1-2 1.2s linear infinite;
  animation: loader-1-2 1.2s linear infinite;
}

@-webkit-keyframes loader-1-2 {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(220deg);
  }
}
@keyframes loader-1-2 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(220deg);
  }
}

.loader-1 span::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: 20px;
  width: 20px;
  clip: rect(0, 20px, 20px, 10px);
  border-radius: 50%;
  -webkit-animation: loader-1-3 1.2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
  animation: loader-1-3 1.2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
}

@-webkit-keyframes loader-1-3 {
  0% {
    -webkit-transform: rotate(-140deg);
    border: 2.5px solid rgb(238, 184, 6);
  }
  50% {
    -webkit-transform: rotate(-160deg);
    border: 2.5px solid rgba(255, 220, 227, 1);
  }
  100% {
    -webkit-transform: rotate(140deg);
    border: 2.5px solid rgb(238, 184, 6);
  }
}

@keyframes loader-1-3 {
  0% {
    transform: rotate(-140deg);
    border: 2.5px solid rgb(238, 184, 6);
  }
  50% {
    transform: rotate(-160deg);
    border: 2.5px solid rgba(255, 220, 227, 1);
  }
  100% {
    transform: rotate(140deg);
    border: 2.5px solid rgb(238, 184, 6);
  }
}
</style>
