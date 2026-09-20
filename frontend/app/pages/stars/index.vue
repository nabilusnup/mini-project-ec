<script setup>
import { useStarsPage } from './script'

const { numberOfStars, selectedType, numberError, typeError, showConfirmation, showResult, starResult, isSaving, history, isLoadingHistory, selectedHistory, isDeleting, authToken, authHeaders, rows, increment, decrement, validateNumber, openConfirmation, generateStars, loadHistory, saveStars, deleteHistory } = useStarsPage()
</script>

<template>
  <div class="page">
    <div class="shell">
      <header class="app-header">
        <CommonBackButton tone="dark" />
        <div class="hero">
          <img src="/assets/stars.png" alt="Stars icon">
        </div>
        <p class="page-title text-display">Get a Stars</p>
        <p class="hero-subtitle">Pick a number and type to collect your stars</p>
      </header>

      <main class="card">
        <div class="counter">
          <button type="button" aria-label="Decrease" @click="decrement">−</button>
          <input
            v-model.number="numberOfStars"
            type="number"
            min="0"
            max="30"
            inputmode="numeric"
            aria-label="Number of stars"
            @change="validateNumber"
          >
          <button type="button" aria-label="Increase" @click="increment">+</button>
        </div>
        <small v-if="numberError" class="field-error">{{ numberError }}</small>

        <fieldset class="types">
          <legend>Choose a type :</legend>

          <label v-for="type in ['Type 1', 'Type 2', 'Type 3']" :key="type">
            <input v-model="selectedType" type="radio" name="star-type" :value="type">
            <span>{{ type }}</span>
          </label>
        </fieldset>
        <small v-if="typeError" class="field-error">{{ typeError }}</small>

        <button type="button" class="primary-button" @click="openConfirmation">
          Next
        </button>

        <StarsHistory
          :items="history"
          :loading="isLoadingHistory"
          @refresh="loadHistory"
          @delete="selectedHistory = $event"
        />
      </main>
    </div>

    <div v-if="showConfirmation" class="overlay" @click.self="showConfirmation = false">
      <section class="modal confirmation-modal">
        <div class="modal-icon" aria-hidden="true">?</div>
        <strong class="modal-title text-display">Are you sure?</strong>
        <p>
          Are you sure you want to earn {{ numberOfStars }} stars with {{ selectedType }}?
        </p>
        <div class="modal-actions">
          <button type="button" class="secondary-button" @click="showConfirmation = false">
            Cancel
          </button>
          <button type="button" class="primary-button" @click="generateStars">
            Yes
          </button>
        </div>
      </section>
    </div>

    <div v-if="showResult" class="overlay" @click.self="showResult = false">
      <section class="modal result-modal">
        <strong class="modal-title text-display">Congratulation!</strong>
        <p>You've earned a bunch of stars – great job!</p>

        <div ref="starResult" class="star-result" :class="selectedType.toLowerCase().replace(' ', '-')">
          <div class="star-canvas" :style="{ '--star-count': numberOfStars }">
            <div v-for="row in rows" :key="row" class="star-row">
              <span v-for="star in row" :key="star">★</span>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button type="button" class="secondary-button" @click="showResult = false">Close</button>
          <button type="button" class="primary-button" :disabled="isSaving" @click="saveStars">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </section>
    </div>

    <ModalConfirmDialog
      v-if="selectedHistory"
      title="Delete History?"
      :loading="isDeleting"
      @cancel="selectedHistory = null"
      @confirm="deleteHistory"
    >
        <p><strong>{{ selectedHistory.number }} Stars — {{ selectedHistory.type }}</strong> will be permanently deleted.</p>
    </ModalConfirmDialog>
  </div>
</template>

<style scoped src="./style.css"></style>
