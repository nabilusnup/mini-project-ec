<script setup>
import { useSpelloutPage } from './script'

const { amount, result, isSaving, history, isLoadingHistory, selectedHistory, isDeleting, amountError, authToken, authHeaders, numericAmount, formattedAmount, formatRupiah, loadHistory, numberToWords, generateWords, saveResult, deleteHistory, handleInput } = useSpelloutPage()
</script>

<template>
  <div class="page">

    <header class="page-hero app-header">
      <CommonBackButton tone="dark" />

      <div class="illustration">
        <img src="/assets/rupiah.png" alt="Rupiah icon">
      </div>

      <p class="page-title text-display">Number to Words</p>

      <p class="hero-subtitle">
        Convert an amount into Indonesian spelled-out words
      </p>
    </header>

    <div class="card">

      <div class="form-section">

        <label>
          Amount
        </label>

        <input
          :value="formattedAmount"
          type="text"
          inputmode="numeric"
          placeholder="Rp 0"
          @input="handleInput"
        >
        <small v-if="amountError" class="field-error">{{ amountError }}</small>

        <button
          class="btn-generate"
          @click="generateWords"
        >
          Spell Out
        </button>

        <div
          v-if="result"
          class="result"
        >
          <span>Result</span>

          <strong>
            {{ result }}
          </strong>
        </div>

        <button
          v-if="result"
          class="btn-save"
          :disabled="isSaving"
          @click="saveResult"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>

      </div>

      <SpelloutHistory
        :items="history"
        :loading="isLoadingHistory"
        @refresh="loadHistory"
        @delete="selectedHistory = $event"
      />

    </div>

    <ModalConfirmDialog
      v-if="selectedHistory"
      title="Delete History?"
      :loading="isDeleting"
      @cancel="selectedHistory = null"
      @confirm="deleteHistory"
    >
        <p>The result <strong>{{ formatRupiah(selectedHistory.amount) }}</strong> will be permanently deleted.</p>
    </ModalConfirmDialog>

  </div>
</template>

<style scoped src="./style.css"></style>
