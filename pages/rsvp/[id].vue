<script setup lang="ts">

const route = useRoute();
const rsvpId = route.params.id;

const rsvpDetails = ref();

const { data } = await useFetch('/api/rsvp/' + rsvpId)
rsvpDetails.value = data

</script>

<template>
    <div class="h-screen grid place-items-center">
            <Ticket />
    </div>
</template>