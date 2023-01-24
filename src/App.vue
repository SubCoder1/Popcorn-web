<!-- Root file of Popcorn-web which defines the root template with top-level routing of this Vue application -->

<template>
  <!-- Error modal only used to show if any server side issue has occured. -->
  <div
    class="modal fade"
    v-show="showErrModal"
    v-bind:class="{ show: showErrModal, 'd-block': showErrModal }"
    refs="srvErrModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-body">
          Server error occured. Please try again after sometime.
        </div>
        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center position-relative rounded-md text-sm mt-2 mb-2"
            data-bs-dismiss="modal"
            @click="srvErrModal(true)"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="loader.showLoader"
    class="d-flex align-items-center justify-content-center h-100"
  >
    <img
      class="auth-page-logo"
      src="@/assets/logo/logo-128x128.png"
      alt="Popcorn logo"
    />
  </div>
  <router-view v-else />
  <div v-if="showErrModal" class="modal-backdrop fade show"></div>
</template>

<script>
import { useLoaderStore } from "@/stores/loader.store";

export default {
  data() {
    const loaderStore = useLoaderStore();
    return {
      showErrModal: false,
      loader: loaderStore,
    };
  },
  methods: {
    srvErrModal: function (Close) {
      if (!this.showErrModal) {
        this.showErrModal = true;
      } else if (Close) {
        this.showErrModal = false;
      }
    },
  },
};
</script>

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
  /* background-image: url("~@/assets/background.png"); */
}

.container-style {
  background: white;
  border-radius: 0.5rem;
}

.container-shadow {
  box-shadow: rgb(0 0 0 / 5%) 0px 4px 12px;
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

.text-xsm {
  font-size: 0.75rem;
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

.input-md {
  width: 350px;
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

.admin-btn {
  background-color: mediumaquamarine;
}

.btn:hover,
.btn:focus {
  color: white;
  background-color: rgb(228, 77, 60);
  box-shadow: none;
  outline: none;
}

.admin-btn:hover,
.admin-btn:focus {
  background-color: #0cc183;
}

.loader-1 {
  height: 20px;
  width: 20px;
  left: 33%;
  transform: translate(-30%, 0);
  -webkit-animation: loader-entry-1 0.3s forwards,
    loader-1-1 4.8s linear infinite;
  animation: loader-entry-1 0.3s forwards, loader-1-1 4.8s linear infinite;
}

.loader-2 {
  height: 20px;
  width: 20px;
  left: 27%;
  transform: translate(-30%, 0);
  -webkit-animation: loader-entry-2 0.3s forwards,
    loader-1-1 4.8s linear infinite;
  animation: loader-entry-2 0.3s forwards, loader-1-1 4.8s linear infinite;
}

@-webkit-keyframes loader-entry-1 {
  0% {
    left: 33%;
  }
  100% {
    left: 30%;
  }
}

@keyframes loader-entry-1 {
  0% {
    left: 33%;
  }
  100% {
    left: 30%;
  }
}

@-webkit-keyframes loader-entry-2 {
  0% {
    left: 27%;
  }
  100% {
    left: 23%;
  }
}

@keyframes loader-entry-2 {
  0% {
    left: 27%;
  }
  100% {
    left: 23%;
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

.loader-1 span,
.loader-2 span {
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

.loader-1 span::after,
.loader-2 span::after {
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

.skeleton {
  animation: skeleton-loading 0.8s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

.skeleton-text {
  width: 135px;
  height: 0.7rem;
  border-radius: 0.25rem;
}

.user-prof-skeleton-md {
  height: 50px;
  width: 50px;
}

.h-fit-content {
  height: fit-content;
}

.br-left {
  animation: border-entry 0.15s forwards;
  -webkit-animation: border-entry 0.15s forwards;
}

.admin-br-left {
  animation: admin-border-entry 0.15s forwards;
  -webkit-animation: admin-border-entry 0.15s forwards;
}

.exp-br-left {
  animation: exp-border-entry 0.15s forwards;
  -webkit-animation: exp-border-entry 0.15s forwards;
}

@-webkit-keyframes border-entry {
  0% {
    border-left: 0px solid rgb(241, 133, 121);
  }
  50% {
    border-left: 3px solid rgb(241, 133, 121);
  }
  100% {
    border-left: 6px solid rgb(241, 133, 121);
  }
}

@keyframes border-entry {
  0% {
    border-left: 0px solid rgb(241, 133, 121);
  }
  50% {
    border-left: 3px solid rgb(241, 133, 121);
  }
  100% {
    border-left: 6px solid rgb(241, 133, 121);
  }
}

@-webkit-keyframes admin-border-entry {
  0% {
    border-left: 0px solid mediumaquamarine;
  }
  50% {
    border-left: 3px solid mediumaquamarine;
  }
  100% {
    border-left: 6px solid mediumaquamarine;
  }
}

@keyframes admin-border-entry {
  0% {
    border-left: 0px solid mediumaquamarine;
  }
  50% {
    border-left: 3px solid mediumaquamarine;
  }
  100% {
    border-left: 6px solid mediumaquamarine;
  }
}

@-webkit-keyframes exp-border-entry {
  0% {
    border-left: 0px solid #6c757d;
  }
  50% {
    border-left: 3px solid #6c757d;
  }
  100% {
    border-left: 6px solid #6c757d;
  }
}

@keyframes exp-border-entry {
  0% {
    border-left: 0px solid #6c757d;
  }
  50% {
    border-left: 3px solid #6c757d;
  }
  100% {
    border-left: 6px solid #6c757d;
  }
}

.btn-sm {
  width: 150px;
}
</style>
