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
        <div
          class="modal-body d-flex flex-column align-items-center text-center"
        >
          <img
            class="m-auto"
            src="@/assets/misc/error.png"
            style="height: 130px"
            alt="Server error"
          />
          <span class="mt-4">
            Looks like its houseful at the moment, Please refresh or try again
            after sometime.
          </span>
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
html,
body {
  height: 100%;
  background-color: rgb(248 246 243);
  scroll-behavior: smooth;
}

#app {
  font-family: "Roboto Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(32 39 44 1);
  height: 100%;
  background-image: url("~@/assets/background/bg-1.png");
  background-size: cover;
  overflow: auto;
}

.container-style {
  background: white;
  border-radius: 0.5rem;
}

.container-shadow {
  box-shadow: rgb(0 0 0 / 8%) 4px 2px 30px 8px;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 25px;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8bbbf;
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
  max-height: 85px;
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
.play-btn,
.update-btn,
.allow-play-perm,
.success,
.accept-invite {
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

.btn-circle-md {
  height: 35px;
  width: 35px;
}

.btn-circle-sm {
  height: 30px;
  width: 30px;
}

.admin-btn:hover,
.admin-btn:focus,
.play-btn:hover,
.play-btn:focus,
.update-btn:hover,
.update-btn:focus,
.allow-play-perm:hover,
.allow-play-perm:focus,
.success:hover,
.success:focus,
.accept-invite:hover,
.accept-invite:focus,
.unmute-sound-btn:hover,
.unmute-sound-btn:focus {
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

.skeleton-text-sm {
  width: 85px;
}

.skeleton-text-xsm {
  width: 50px;
}

.user-prof-skeleton-lg {
  height: 80px;
  width: 80px;
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
  width: 65px;
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
.delete-gang-btn,
.mic-off-btn,
.ss-off,
.vid-off-btn {
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
.mic-off-btn:hover,
.ss-off:hover,
.vid-off-btn:hover,
.delete-content-btn:hover,
.mute-sound-btn:hover,
.modal-close-btn:focus,
.kick-member-btn:focus,
.decline-invite-btn:focus,
.leave-gang-btn:focus,
.delete-gang-btn:focus,
.delete-content-btn:focus,
.mic-off-btn:focus,
.vid-off-btn:focus,
.ss-off:focus,
.mute-sound-btn:focus {
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

video {
  border-radius: 0.5rem 0.5rem 0 0;
  height: 100% !important;
  width: 100% !important;
  background: rgb(43, 42, 51);
}

.user-vc {
  border-radius: 50% !important;
  object-fit: cover;
  background: transparent;
}

.gang-info-btn,
.mic-btn,
.ss-on,
.vid-btn {
  background: mediumpurple;
}

.gang-info-btn:hover,
.gang-info-btn:focus,
.mic-btn:hover,
.vid-btn:hover,
.ss-on:hover,
.mic-btn:focus,
.vid-btn:focus,
.ss-on:focus {
  background: #7b56c7;
}

.handle-txt-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
}

@media only screen and (max-width: 1200px) {
  video {
    width: 100%;
  }
}

@media only screen and (max-width: 1050px) {
  .input-md {
    width: 310px;
  }

  .form-errors {
    width: 315px;
  }

  h4 {
    font-size: 17px;
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
    width: 100%;
    height: auto;
  }
}

@media only screen and (max-width: 522px) {
  .input-md {
    width: 270px;
  }
}

@media only screen and (max-width: 497px) {
  label {
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }

  .input-md {
    width: 100%;
  }

  video {
    height: 100%;
    width: 100%;
  }

  .btn-circle {
    height: 44px;
    width: 44px;
  }

  .profile-pic-sm {
    height: 40px;
  }

  .profile-pic-lg {
    height: 50px;
  }

  .empty-search-img {
    height: 90px;
  }
}
</style>
