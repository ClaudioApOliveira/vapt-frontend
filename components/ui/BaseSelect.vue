<script setup lang="ts">
interface Option {
    value: string | number
    label: string
}

interface Props {
    modelValue: string | number
    label?: string
    options: Option[] | string[]
    placeholder?: string
    required?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    required: false,
    disabled: false,
    placeholder: 'Selecione'
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
}>()

const normalizedOptions = computed(() => {
    return props.options.map(opt => {
        if (typeof opt === 'string') {
            return { value: opt, label: opt }
        }
        return opt
    })
})

const onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div class="form-group">
        <label v-if="label" class="form-label">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>
        <select :value="modelValue" :required="required" :disabled="disabled" class="form-select" @change="onChange">
            <option value="">{{ placeholder }}</option>
            <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
            </option>
        </select>
    </div>
</template>
