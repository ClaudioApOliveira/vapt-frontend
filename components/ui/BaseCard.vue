<script setup lang="ts">
interface Props {
    title?: string
    padding?: boolean
}

withDefaults(defineProps<Props>(), {
    padding: true
})
</script>

<template>
    <div class="card" :class="{ 'p-6': padding }">
        <h2 v-if="title" class="card-title">{{ title }}</h2>
        <slot />
    </div>
</template>
