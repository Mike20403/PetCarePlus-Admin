<template>
  <AppModal :isOpen="isOpen" :title="isEditing ? t('user.editUser') : t('user.userDetail')" @close="onClose">
    <form @submit.prevent="onSave">
      <FormInput :label="t('user.name')" name="name" v-model="form.name" :readonly="!isEditing" />
      <FormInput :label="t('user.lastName')" name="lastName" v-model="form.lastName" :readonly="!isEditing" />
      <FormInput :label="t('user.email')" name="email" v-model="form.email" :readonly="!isEditing" type="email" />
      <FormInput :label="t('user.phoneNumber')" name="phoneNumber" v-model="form.phoneNumber" :readonly="!isEditing" />
      <FormSelect :label="t('user.role')" name="role" v-model="form.role" :options="roleOptions" :disabled="!isEditing" @change="onRoleChange" />
      <FormInput :label="t('user.createdAt')" name="createdAt" :modelValue="form.createdAt" readonly />
      <FormInput :label="t('user.updatedAt')" name="updatedAt" :modelValue="form.updatedAt" readonly />
      <div class="d-flex gap-2 mt-3">
        <button v-if="!isEditing" type="button" class="btn btn-primary" @click="isEditing = true">{{ t('common.edit') }}</button>
        <button v-if="isEditing" type="submit" class="btn btn-success">{{ t('common.save') }}</button>
        <button v-if="isEditing" type="button" class="btn btn-secondary" @click="onCancelEdit">{{ t('common.cancel') }}</button>
        <button type="button" class="btn" :class="form.blockedAt ? 'btn-success' : 'btn-danger'" @click="onToggleBlock">
          {{ form.blockedAt ? t('user.unblock') : t('user.block') }}
        </button>
      </div>
    </form>
    <ConfirmationDialog v-if="showRoleConfirm" :isOpen="showRoleConfirm" :title="t('user.confirmRoleChange')" @close="showRoleConfirm = false" @confirm="confirmRoleChange">
      <template #default>
        {{ t('user.confirmRoleChangeText', { role: form.role }) }}
      </template>
    </ConfirmationDialog>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppModal from './AppModal.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import { FormInput, FormSelect } from './forms'
import type { User } from '@/types/user'

const props = defineProps<{
  isOpen: boolean
  user: User | null
  loading?: boolean
}>()
const emit = defineEmits(['close', 'save', 'block', 'roleChange'])
const { t } = useI18n()

const isEditing = ref(false)
const showRoleConfirm = ref(false)
const pendingRole = ref('')

const form = ref<User>({
  id: '',
  email: '',
  name: '',
  lastName: '',
  phoneNumber: '',
  role: '',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: '',
  updatedAt: '',
  deletedAt: null
})

const roleOptions = computed(() => [
  { value: 'ADMIN', text: t('user.roleAdmin') },
  { value: 'MANAGER', text: t('user.roleManager') },
  { value: 'USER', text: t('user.roleUser') }
])

watch(() => props.user, (val) => {
  if (val) form.value = { ...val }
  isEditing.value = false
})

function onClose() {
  isEditing.value = false
  emit('close')
}

function onCancelEdit() {
  if (props.user) form.value = { ...props.user }
  isEditing.value = false
}

function onSave() {
  emit('save', { ...form.value })
  isEditing.value = false
}

function onToggleBlock() {
  emit('block', form.value)
}

function onRoleChange(e: Event) {
  if (!isEditing.value) return
  showRoleConfirm.value = true
  pendingRole.value = (e.target as HTMLSelectElement).value
}

function confirmRoleChange() {
  form.value.role = pendingRole.value
  showRoleConfirm.value = false
  emit('roleChange', form.value)
}
</script>

<style scoped>
.btn[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style> 