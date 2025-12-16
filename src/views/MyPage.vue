<template>
  <div class="min-h-screen bg-background-light px-8 py-10 text-text-light dark:bg-background-dark dark:text-text-dark">
    <div class="mx-auto flex w-[1200px] min-w-[1200px] max-w-[1280px] flex-col gap-6">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-black leading-tight tracking-[-0.02em]">마이 페이지</h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark">회원 정보를 확인하고 비밀번호를 변경할 수 있습니다.</p>
      </header>

      <section v-if="!isVerified" class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <h2 class="text-xl font-bold text-text-light dark:text-text-dark">비밀번호 확인</h2>
        <p class="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">마이 페이지 진입을 위해 비밀번호를 한 번 더 확인합니다.</p>
        <form class="mt-4 flex items-end gap-4" @submit.prevent="handlePasswordCheck">
          <div class="flex-1">
            <label class="mb-1 block text-sm font-medium text-text-light dark:text-text-dark" for="verifyPassword">비밀번호</label>
            <input
              id="verifyPassword"
              v-model="verifyPassword"
              type="password"
              required
              class="h-12 w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            class="h-12 rounded-lg bg-primary px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            :disabled="loadingVerify"
          >
            {{ loadingVerify ? '확인 중...' : '확인' }}
          </button>
        </form>
      </section>

      <template v-else>
        <section class="grid grid-cols-2 gap-6">
          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <h2 class="mb-4 text-xl font-bold text-text-light dark:text-text-dark">회원 정보</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">이메일</label>
                <input
                  class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-secondary-light dark:border-border-dark dark:bg-background-dark dark:text-text-secondary-dark"
                  :value="profileForm.email || '—'"
                  readonly
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">이름</label>
                <input
                  class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                  v-model="profileForm.name"
                  :readonly="!isEditMode"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">성별</label>
                <select
                  v-model="profileForm.gender"
                  :disabled="!isEditMode"
                  class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                >
                  <option value="" disabled>선택</option>
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                </select>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">생년월일</label>
                <input
                  class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                  v-model="profileForm.birthDate"
                  :readonly="!isEditMode"
                  type="date"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">신장 (cm)</label>
                <input
                  class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                  v-model="profileForm.heightCm"
                  :readonly="!isEditMode"
                  type="number"
                  step="0.1"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">체중 (kg)</label>
                <input
                  class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                  v-model="profileForm.weightKg"
                  :readonly="!isEditMode"
                  type="number"
                  step="0.1"
                />
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-3">
              <button
                v-if="!isEditMode"
                type="button"
                class="rounded-lg border border-border-light bg-background-light px-4 py-2 text-sm font-semibold text-text-light transition hover:bg-border-light/60 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                @click="startEdit"
              >
                회원 정보 수정
              </button>
              <template v-else>
                <button
                  type="button"
                  class="rounded-lg border border-border-light bg-background-light px-4 py-2 text-sm font-semibold text-text-light transition hover:bg-border-light/60 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                  @click="cancelEdit"
                >
                  취소
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                  :disabled="saveLoading"
                  @click="handleSaveProfile"
                >
                  {{ saveLoading ? '저장 중...' : '완료' }}
                </button>
              </template>
            </div>
          </div>

          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <h2 class="mb-4 text-xl font-bold text-text-light dark:text-text-dark">비밀번호 변경</h2>
            <form class="space-y-4" @submit.prevent="handlePasswordChange">
              <div>
                <label class="mb-1 block text-sm font-medium text-text-light dark:text-text-dark" for="currentPassword">현재 비밀번호</label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="h-11 w-full rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-text-light dark:text-text-dark" for="newPassword">새 비밀번호</label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="8"
                  class="h-11 w-full rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-text-light dark:text-text-dark" for="confirmPassword">새 비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  minlength="8"
                  class="h-11 w-full rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                />
              </div>
              <button
                type="submit"
                class="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                :disabled="loadingChange"
              >
                {{ loadingChange ? '변경 중...' : '비밀번호 변경하기' }}
              </button>
            </form>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { passwordChange, passwordCheck, updateMember } from '@/services/memberService';

const userStore = useUserStore();
const member = computed(() => userStore.member || {});

const formattedBirthDate = computed(() => member.value.birthDate || '');
const formattedHeight = computed(() => (member.value.heightCm ? `${member.value.heightCm} cm` : ''));
const formattedWeight = computed(() => (member.value.weightKg ? `${member.value.weightKg} kg` : ''));

const verifyPassword = ref('');
const isVerified = ref(false);
const loadingVerify = ref(false);

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const loadingChange = ref(false);

const isEditMode = ref(false);
const saveLoading = ref(false);
const profileForm = reactive({
  email: '',
  name: '',
  gender: '',
  birthDate: '',
  heightCm: '',
  weightKg: '',
});

const hydrateProfileForm = () => {
  profileForm.email = member.value.email || '';
  profileForm.name = member.value.name || '';
  profileForm.gender = member.value.gender || '';
  profileForm.birthDate = member.value.birthDate || '';
  profileForm.heightCm = member.value.heightCm ?? '';
  profileForm.weightKg = member.value.weightKg ?? '';
};

watch(
  member,
  () => {
    hydrateProfileForm();
  },
  { immediate: true }
);

const handlePasswordCheck = async () => {
  if (loadingVerify.value) return;
  loadingVerify.value = true;
  try {
    const res = await passwordCheck({ password: verifyPassword.value });
    if (res.data === true) {
      isVerified.value = true;
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  } catch (error) {
    console.error('비밀번호 확인 실패', error);
    alert('비밀번호 확인 중 오류가 발생했습니다.');
  } finally {
    loadingVerify.value = false;
    verifyPassword.value = '';
  }
};

const handlePasswordChange = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.');
    return;
  }
  loadingChange.value = true;
  try {
    await passwordChange({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    alert('비밀번호가 변경되었습니다.');
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    console.error('비밀번호 변경 실패', error);
    alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
  } finally {
    loadingChange.value = false;
  }
};

const startEdit = () => {
  hydrateProfileForm();
  isEditMode.value = true;
};

const cancelEdit = () => {
  hydrateProfileForm();
  isEditMode.value = false;
};

const handleSaveProfile = async () => {
  saveLoading.value = true;
  try {
    const payload = {
      name: profileForm.name,
      gender: profileForm.gender,
      birthDate: profileForm.birthDate,
      heightCm: profileForm.heightCm,
      weightKg: profileForm.weightKg,
    };
    const res = await updateMember(payload);
    // 백엔드에서 갱신된 member 정보를 반환한다고 가정
    const updatedMember = res.data?.member || { ...member.value, ...payload };
    userStore.saveUser({
      tokenType: userStore.tokenType,
      accessToken: userStore.accessToken,
      member: updatedMember,
    });
    isEditMode.value = false;
    alert('회원 정보가 수정되었습니다.');
  } catch (error) {
    console.error('회원 정보 수정 실패', error);
    alert('회원 정보 수정에 실패했습니다.');
  } finally {
    saveLoading.value = false;
  }
};
</script>
