<script setup lang="ts">
interface Props {
    size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
    size: 'md'
})

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
}
</script>

<template>
    <div class="flex justify-center py-4">
        <div class="animate-spin rounded-full border-b-2 border-green-600" :class="sizeClasses[size]"></div>
    </div>
</template>
