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
            class="btn modal-close-btn rounded-md text-sm"
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
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap");

html,
body {
  height: 100%;
  background-color: rgb(248 246 243);
  scrollbar-width: 10px;
  scrollbar-color: rgb(240, 90, 73);
}

#app {
  font-family: "Roboto Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(32 39 44 1);
  height: 100%;
  background-image: url("~@/assets/background/bg-1.png");
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
  width: max-content;
}

a:hover {
  color: rgb(228, 77, 60);
}

h4 {
  font-weight: 400;
}

::selection {
  color: white;
  background: rgb(241, 133, 121);
}

::-moz-selection {
  color: white;
  background: rgb(241, 133, 121);
}

.text-xsm {
  font-size: 0.775rem;
  line-height: 1.25rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xsm {
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.text-justify {
  text-align: justify;
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
  height: 85px;
  width: 350px;
  overflow-wrap: break-word;
  color: rgb(241, 133, 121);
  padding: 0.75rem;
}

.form-errors-md {
  height: 65px;
  width: auto;
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
  height: 48px;
  -moz-transition: all 0.2s ease-in;
  -webkit-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}

.admin-btn,
.success {
  background-color: mediumaquamarine;
}

.btn:hover,
.btn:focus {
  color: white;
  background-color: rgb(228, 77, 60);
  box-shadow: none;
  outline: none;
}

.btn-circle {
  height: 48px;
  width: 48px;
}

.admin-btn:hover,
.admin-btn:focus,
.success:hover,
.success:focus {
  background-color: #0cc183;
}

.loader {
  /* the colors */
  --c1: #e22282;
  --c2: #d3ce3d;
  --c3: #9634f1;
  --c4: #554236;
  width: 20px; /* control the size */
  aspect-ratio: 8/5;
  --_g: no-repeat radial-gradient(#000 68%, #0000 71%);
  -webkit-mask: var(--_g), var(--_g), var(--_g);
  mask: var(--_g), var(--_g), var(--_g);
  -webkit-mask-size: 25% 40%;
  mask-size: 25% 40%;
  background: conic-gradient(var(--c1) 50%, var(--c2) 0) no-repeat,
    conic-gradient(var(--c3) 50%, var(--c4) 0) no-repeat;
  background-size: 200% 50%;
  animation: back 4s infinite steps(1), load 2s infinite;
}

@keyframes load {
  0% {
    -webkit-mask-position: 0% 0%, 50% 0%, 100% 0%;
    mask-position: 0% 0%, 50% 0%, 100% 0%;
  }
  16.67% {
    -webkit-mask-position: 0% 100%, 50% 0%, 100% 0%;
    mask-position: 0% 100%, 50% 0%, 100% 0%;
  }
  33.33% {
    -webkit-mask-position: 0% 100%, 50% 100%, 100% 0%;
    mask-position: 0% 100%, 50% 100%, 100% 0%;
  }
  50% {
    -webkit-mask-position: 0% 100%, 50% 100%, 100% 100%;
    mask-position: 0% 100%, 50% 100%, 100% 100%;
  }
  66.67% {
    -webkit-mask-position: 0% 0%, 50% 100%, 100% 100%;
    mask-position: 0% 0%, 50% 100%, 100% 100%;
  }
  83.33% {
    -webkit-mask-position: 0% 0%, 50% 0%, 100% 100%;
    mask-position: 0% 0%, 50% 0%, 100% 100%;
  }
  100% {
    -webkit-mask-position: 0% 0%, 50% 0%, 100% 0%;
    mask-position: 0% 0%, 50% 0%, 100% 0%;
  }
}

@keyframes back {
  0%,
  100% {
    background-position: 0% 0%, 0% 100%;
  }
  25% {
    background-position: 100% 0%, 0% 100%;
  }
  50% {
    background-position: 100% 0%, 100% 100%;
  }
  75% {
    background-position: 0% 0%, 100% 100%;
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
  animation: border-entry 0.2s forwards;
  -webkit-animation: border-entry 0.2s ease-in forwards;
}

.admin-br-left {
  animation: admin-border-entry 0.2s forwards;
  -webkit-animation: admin-border-entry 0.2s ease-in forwards;
}

.exp-br-left {
  animation: exp-border-entry 0.2s forwards;
  -webkit-animation: exp-border-entry 0.2s ease-in forwards;
}

@-webkit-keyframes border-entry {
  0% {
    border-left: 0px solid rgb(241, 133, 121);
  }
  100% {
    border-left: 6px solid rgb(241, 133, 121);
  }
}

@keyframes border-entry {
  0% {
    border-left: 0px solid rgb(241, 133, 121);
  }
  100% {
    border-left: 6px solid rgb(241, 133, 121);
  }
}

@-webkit-keyframes admin-border-entry {
  0% {
    border-left: 0px solid mediumaquamarine;
  }
  100% {
    border-left: 6px solid mediumaquamarine;
  }
}

@keyframes admin-border-entry {
  0% {
    border-left: 0px solid mediumaquamarine;
  }
  100% {
    border-left: 6px solid mediumaquamarine;
  }
}

@-webkit-keyframes exp-border-entry {
  0% {
    border-left: 0px solid #6c757d;
  }
  100% {
    border-left: 6px solid #6c757d;
  }
}

@keyframes exp-border-entry {
  0% {
    border-left: 0px solid #6c757d;
  }
  100% {
    border-left: 6px solid #6c757d;
  }
}

.btn-xsm {
  width: 60px;
  height: 40px;
}

.btn-sm {
  width: 150px;
}

.btn-md {
  width: 203px;
}

.input-xsm {
  width: 60px;
}

.profile-pic-xsm {
  height: 32px;
}

.profile-pic-sm {
  height: 45px;
}

.profile-pic-lg {
  height: 64px;
}

.modal-header {
  padding: 1rem 1rem;
  border-bottom: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.modal-close-btn,
.kick-member-btn,
.decline-invite-btn,
.leave-gang-btn,
.delete-content-btn,
.delete-gang-btn {
  background: palevioletred;
  border: 0;
  -moz-transition: all 0.2s ease-in;
  -webkit-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}

.modal-close-btn:hover,
.kick-member-btn:hover,
.decline-invite-btn:hover,
.leave-gang-btn:hover,
.delete-gang-btn:hover,
.delete-content-btn:hover,
.modal-close-btn:focus,
.kick-member-btn:focus,
.decline-invite-btn:focus,
.leave-gang-btn:focus,
.delete-gang-btn:focus,
.delete-content-btn:focus {
  background: #d94072;
}

strong {
  font-weight: 500;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media only screen and (max-width: 1050px) {
  .input-md {
    width: 310px;
  }

  .form-errors {
    width: 315px;
  }

  h4 {
    font-size: 20px;
  }

  .text-sm {
    font-size: 0.805rem;
  }

  .btn-md {
    width: 180px;
  }
}

@media only screen and (max-width: 955px) {
  .form-errors {
    width: 299px;
  }
}

@media only screen and (max-width: 522px) {
  .input-md {
    width: 270px;
  }
}

@media only screen and (max-width: 497px) {
  .form-errors {
    width: 224px;
  }

  label {
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }

  .input-md {
    width: 100%;
  }
}
</style>
