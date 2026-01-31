<script setup lang="ts">
interface Props {
    title?: string
    cols?: 1 | 2 | 3
}

withDefaults(defineProps<Props>(), {
    cols: 1
})

const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
}
</script>

<template>
    <div class="form-section">
        <h3 v-if="title" class="form-section-title">{{ title }}</h3>
        <div class="grid gap-4" :class="gridClasses[cols]">
            <slot />
        </div>
    </div>
</template>
