<script setup lang="ts">
interface Props {
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    block?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false
})
</script>

<template>
    <button :type="type" :disabled="disabled || loading" class="btn" :class="[
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-block': block, 'btn-loading': loading }
    ]">
        <span v-if="loading" class="btn-spinner"></span>
        <slot />
    </button>
</template>
