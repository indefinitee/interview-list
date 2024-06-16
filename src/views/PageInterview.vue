<script setup lang="ts">
import type { IInterview, IStage } from '@/interfaces';
import { useUserStore } from '@/stores/user';
import { Timestamp, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const isLoading = ref<boolean>(false)
const interview = ref<IInterview>()

const docRef = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }
    interview.value = data
  }

  isLoading.value = false

}

onMounted(async () => await getData())


const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true

  await updateDoc(docRef, { ...interview.value })
  await getData()
}
</script>
<template>
  <app-progress v-if="isLoading" class="spinner"/>
  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    <app-card>
      <template #title>Собседование в компанию {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компания</label>
          <app-input_text class="input mb-3" id="company" v-model="interview.company"></app-input_text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Описание вакансии</label>
          <app-input_text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink"></app-input_text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт (имя)</label>
          <app-input_text class="input mb-3" id="hrName" v-model="interview.hrName"></app-input_text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp HR</label>
          <app-input_text class="input mb-3" id="contactWhatsApp" v-model="interview.contactWhatsApp"></app-input_text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram HR</label>
          <app-input_text class="input mb-3" id="contactTelegram" v-model="interview.contactTelegram"></app-input_text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон HR</label>
          <app-input_text class="input mb-3" id="contactPhone" v-model="interview.contactPhone"></app-input_text>
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              inputId="salaryFrom"
              placeholder="Зарплатная вилка от"
              v-model="interview.salaryFrom"
            ></app-input-number>
          </div>
          <div class="flex-auto">
            <app-input-number
              inputId="salaryTo"
              placeholder="Зарплатная вилка до"
              v-model="interview.salaryTo"
            ></app-input-number>
          </div>
        </div>


        <app-button
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
          @click="addStage"
        ></app-button>
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Название этапа </label>
              <app-input_text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name"></app-input_text>
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Дата прохождения этапа </label>
              <app-calendar
                class="input mb-3"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              ></app-calendar>
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-desc-${index}`">Комментарий</label>
              <app-textarea :id="`stage-desc-${index}`" class="input mb-3" rows="5" v-model="stage.description"></app-textarea>
            </div>
            <app-button severity="danger" label="Удалить этап" @click="removeStage(index)"/>
          </div>
      </template>
        <div class="flex justify-content-between gap-3 mb-3">
          <div class="flex flex-wrap gap-3">
            <div class="flex align-items-center">
              <app-radio-btn
                inputId="interviewResult1"
                name="result"
                value="Refusal"
                v-model="interview.result"
              ></app-radio-btn>
              <label for="interviewResult1" class="ml-2">Отказ</label>
            </div>
            <div class="flex align-items-center">
              <app-radio-btn inputId="interviewResult2" name="result" value="Offer" v-model="interview.result" ></app-radio-btn>
              <label for="interviewResult2" class="ml-2">Оффер</label>
            </div>
          </div>
          <div>
            <app-button label="Сохранить" icon="pi pi-save" @click="saveInterview"></app-button>
          </div>
        </div>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
