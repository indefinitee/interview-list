<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import type { ComputedRef } from 'vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

interface IMenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId)
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId)
  },
  {
    label: 'Все собеседования',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId)
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/stats',
    show: computed((): boolean => !!userStore.userId)
  }
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}
</script>

<template>
  <app-menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <div v-if="userStore.userId" @click="signOutMethod" class="flex align-item-center menu-exit">
        <div class="pi pi-sign-out p-p-menuitem-icon"></div>
        <span class="ml-2">Выход</span>
      </div>
    </template>
  </app-menubar>
</template>

<style scoped>
.menu {
  margin: 30px 0;
}

.menu-exit {
  cursor: pointer;
}
</style>
