<template>
  <form @submit.prevent="createGang" class="gang-join-form">
    <h3>Join a Gang!</h3>
    <p
      class="form-errors rounded-md text-sm mt-2"
      v-bind:class="{ 'show-error': showErr }"
    >
      {{ formErr }}
    </p>
    <input
      type="text"
      class="form-control text-sm rounded-md mb-3"
      placeholder="Gang Name"
      v-model="gang_name"
      required
    />
    <input
      type="text"
      class="form-control text-sm rounded-md mb-3"
      placeholder="Passcode"
      v-model="gang_passcode"
      required
    />
    <button
      type="submit"
      class="btn d-flex align-items-center justify-content-center position-relative w-100 rounded-md text-sm mt-2 mb-2"
    >
      <div v-if="form_submitted" class="loader-1 position-absolute">
        <span />
      </div>
      Join
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form_submitted: false,
      gang_name: "",
      gang_passcode: "",
      showErr: false,
      formErr: "",
    };
  },
  name: "GangJoin",
  methods: {
    createGang: async function () {},
  },
};
</script>
