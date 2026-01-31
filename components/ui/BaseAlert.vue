<script setup lang="ts">
interface Props {
    type?: 'success' | 'error' | 'warning' | 'info'
    dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    dismissible: false
})

const visible = ref(true)

const dismiss = () => {
    visible.value = false
}
</script>

<template>
    <div v-if="visible" class="alert" :class="`alert-${type}`">
        <div class="flex-1">
            <slot />
        </div>
        <button v-if="dismissible" @click="dismiss" class="alert-dismiss">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>
