<script setup lang="ts">
interface Props {
    modelValue: string | number
    label?: string
    placeholder?: string
    type?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    disabled: false,
    readonly: false
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
}>()

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}
</script>

<template>
    <div class="form-group">
        <label v-if="label" class="form-label">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>
        <input :type="type" :value="modelValue" :placeholder="placeholder" :required="required" :disabled="disabled"
            :readonly="readonly" class="form-input" :class="{ 'bg-gray-50': readonly, 'border-red-500': error }"
            @input="onInput">
        <p v-if="error" class="form-error">{{ error }}</p>
    </div>
</template>
