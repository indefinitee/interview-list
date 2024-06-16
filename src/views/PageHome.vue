<script setup lang="ts">
import type { IInterview } from '@/interfaces'
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const db = getFirestore()

const company = ref<string>('')
const vacancyLink = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsApp = ref<string>('')
const contactPhone = ref<string>('')
const hrName = ref<string>('')

const loading = ref<boolean>(false)

const addNewInterview = async (): Promise<void> => {
  loading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date()
  }

  const userId = getAuth().currentUser?.uid

  if (userId) {
    await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload).then(() => {
      router.push('/list')
    })
  }
}

const disabledSaveButton = computed<boolean>(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input_text class="input mb-3" placeholder="Компания" v-model="company" />
        <app-input_text
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Описание вакансии (ссылка)"
        />
        <app-input_text v-model="hrName" class="input mb-3" placeholder="Контакт (имя)" />
        <app-input_text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <app-input_text
          v-model="contactWhatsApp"
          class="input mb-3"
          placeholder="WhatsApp телефон HR"
        />
        <app-input_text v-model="contactPhone" class="input mb-3" placeholder="Телефон HR" />
        <app-button
          @click="addNewInterview"
          label="Создать собеседование"
          :disabled="disabledSaveButton"
          :loading="loading"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
}

.content-interview {
  max-width: 600px;
  margin: auto;
}
</style>
