<script setup lang="ts">
interface Props {
    title: string
    subtitle?: string
}

defineProps<Props>()
</script>

<template>
    <div class="page-header">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
</template>
