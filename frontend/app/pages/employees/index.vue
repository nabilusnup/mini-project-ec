<script setup>
import { useEmployeesPage } from './script'

const { API_URL, authToken, authHeaders, search, employees, error, isLoadingEmployees, formatSalary, formattedSalary, avatarInitial, salaryRanges, selectedSalaryRange, showFormModal, showDetailModal, showDeleteModal, modalMode, editingEmployeeId, detailEmployee, selectedDeleteEmployee, isSubmitting, isDeleting, isLoadingDetail, defaultForm, form, fieldErrors, resetForm, dataProvinsi, dataKabupaten, dataKecamatan, dataKelurahan, getDataProvinsi, getDataKabupaten, getDataKecamatan, getDataKelurahan, onProvinceChange, onCityChange, onDistrictChange, onVillageChange, findLocationByName, loadLocationForEdit, openAddModal, openEditModal, closeFormModal, submitEmployee, openShowModal, closeDetailModal, editFromDetail, deleteFromDetail, openDeleteModal, closeDeleteModal, deleteEmployee } = useEmployeesPage()
</script>

<template>
  <div class="container">

    <header class="page-header app-header">
      <div class="page-header-inner">
        <CommonBackButton />

        <div class="header-row">
          <div>
            <p class="header-title text-display">Employee Management</p>
            <p class="header-subtitle">Manage employee data</p>
          </div>

          <button
            class="btn-add"
            @click="openAddModal"
          >
            + Add
          </button>
        </div>

        <div class="search-container">
          <input
            v-model="search"
            type="text"
            placeholder="Search employee..."
            class="search-input"
          >
        </div>
      </div>
    </header>

    <div class="content">
<p
      v-if="isLoadingEmployees"
      class="state-message"
    >
      Loading...
    </p>
<p
      v-else-if="error"
      class="state-message error-message"
    >
      Failed to load employees.
    </p>

    <template v-else>

      <div class="employee-list">
        <button
          v-for="employee in employees"
          :key="employee.employee_id"
          type="button"
          class="employee-row"
          @click="openShowModal(employee.employee_id)"
        >
          <span class="card-avatar" aria-hidden="true">{{ avatarInitial(employee.name) }}</span>
          <span class="card-identity">
            <strong class="employee-name">{{ employee.name }}</strong>
            <small>{{ employee.employee_id }}</small>
            <span>{{ employee.position }}</span>
          </span>
          <span class="detail-arrow" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
        </button>
      </div>
<div
        v-if="employees.length === 0"
        class="empty"
      >
        No employees found
      </div>

    </template>
    </div>
<div
      v-if="showFormModal"
      class="modal-overlay"
      @click.self="closeFormModal"
    >
      <div class="modal-container">

        <div class="modal-header">

          <div>
            <p class="modal-title text-display">
              {{
                modalMode === 'add'
                  ? 'Add Employee'
                  : 'Edit Employee'
              }}
            </p>

            <p>
              {{
                modalMode === 'add'
                  ? 'Fill employee information'
                  : 'Update employee information'
              }}
            </p>
          </div>

          <button
            class="btn-close"
            type="button"
            @click="closeFormModal"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>

        </div>

        <div class="modal-body">
<div class="form-group">
            <label>Employee ID</label>

            <input
              v-model="form.employee_id"
              type="text"
              placeholder="Example: EMP002"
              :disabled="modalMode === 'edit'"
            >
            <small v-if="fieldErrors.employee_id" class="field-error">{{ fieldErrors.employee_id }}</small>
          </div>
<div class="form-group">
            <label>Name</label>

            <input
              v-model="form.name"
              type="text"
              placeholder="Employee name"
            >
            <small v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</small>
          </div>
<div class="form-group">
            <label>Birth Date</label>

            <input
              v-model="form.birth_date"
              type="date"
            >
            <small v-if="fieldErrors.birth_date" class="field-error">{{ fieldErrors.birth_date }}</small>
          </div>
<div class="form-group">
            <label>Age</label>

            <input
              v-model="form.age"
              type="number"
              placeholder="Age"
            >
            <small v-if="fieldErrors.age" class="field-error">{{ fieldErrors.age }}</small>
          </div>
          <div class="form-group full-width">
            <label>Address</label>

            <textarea
              v-model="form.address"
              placeholder="Employee address"
            ></textarea>
            <small v-if="fieldErrors.address" class="field-error">{{ fieldErrors.address }}</small>
          </div>
<div class="form-group">
            <label>Province</label>

            <select
              v-model="form.province_id"
              @change="onProvinceChange"
            >
              <option value="">
                Select Province
              </option>

              <option
                v-for="province in dataProvinsi"
                :key="province.id"
                :value="province.id"
              >
                {{ province.name }}
              </option>
            </select>
            <small v-if="fieldErrors.province" class="field-error">{{ fieldErrors.province }}</small>
          </div>
<div class="form-group">
            <label>City / Regency</label>

            <select
              v-model="form.city_id"
              :disabled="!form.province_id"
              @change="onCityChange"
            >
              <option value="">
                Select City / Regency
              </option>

              <option
                v-for="city in dataKabupaten"
                :key="city.id"
                :value="city.id"
              >
                {{ city.name }}
              </option>
            </select>
            <small v-if="fieldErrors.city" class="field-error">{{ fieldErrors.city }}</small>
          </div>
<div class="form-group">
            <label>District</label>

            <select
              v-model="form.district_id"
              :disabled="!form.city_id"
              @change="onDistrictChange"
            >
              <option value="">
                Select District
              </option>

              <option
                v-for="district in dataKecamatan"
                :key="district.id"
                :value="district.id"
              >
                {{ district.name }}
              </option>
            </select>
            <small v-if="fieldErrors.district" class="field-error">{{ fieldErrors.district }}</small>
          </div>
<div class="form-group">
            <label>Village</label>

            <select
              v-model="form.village_id"
              :disabled="!form.district_id"
              @change="onVillageChange"
            >
              <option value="">
                Select Village
              </option>

              <option
                v-for="village in dataKelurahan"
                :key="village.id"
                :value="village.id"
              >
                {{ village.name }}
              </option>
            </select>
            <small v-if="fieldErrors.village" class="field-error">{{ fieldErrors.village }}</small>
          </div>
<div class="form-group">
            <label>Position</label>

            <select
              v-model="form.position"
            >
              <option value="">Select Position</option>
              <option value="Staff">Staff</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Manager">Manager</option>
            </select>

            <small v-if="fieldErrors.position" class="field-error">{{ fieldErrors.position }}</small>

            <small v-if="selectedSalaryRange" class="salary-hint">
              Salary: Rp {{ formatSalary(selectedSalaryRange.min) }}
              – Rp {{ formatSalary(selectedSalaryRange.max) }}
            </small>
          </div>
<div class="form-group">
            <label>Salary</label>

            <div class="salary-input">
              <input
                v-model="formattedSalary"
                type="text"
                inputmode="numeric"
                placeholder="0"
              >
            </div>
            <small v-if="fieldErrors.salary" class="field-error">{{ fieldErrors.salary }}</small>
          </div>
<div class="form-group">
            <label>Email</label>

            <input
              v-model="form.email"
              type="email"
              placeholder="employee@example.com"
            >
            <small v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</small>
          </div>
<div class="form-group">
            <label>
              Password
              <span
                v-if="modalMode === 'edit'"
                class="optional"
              >
                (optional)
              </span>
            </label>

            <input
              v-model="form.password"
              type="password"
              :placeholder="
                modalMode === 'add'
                  ? 'Minimum 6 characters'
                  : 'Leave blank if unchanged'
              "
            >
            <small v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</small>
          </div>

          <div class="form-group full-width">
            <label>
              Retype Password
              <span
                v-if="modalMode === 'edit'"
                class="optional"
              >
                (optional)
              </span>
            </label>

            <input
              v-model="form.password_confirmation"
              type="password"
              :placeholder="
                modalMode === 'add'
                  ? 'Retype password'
                  : 'Retype only when changing password'
              "
            >
            <small v-if="fieldErrors.password_confirmation" class="field-error">
              {{ fieldErrors.password_confirmation }}
            </small>
          </div>

        </div>

        <div class="modal-footer">

          <button
            class="btn-cancel"
            type="button"
            :disabled="isSubmitting"
            @click="closeFormModal"
          >
            Cancel
          </button>

          <button
            class="btn-save"
            type="button"
            :disabled="isSubmitting"
            @click="submitEmployee"
          >
            {{
              isSubmitting
                ? 'Saving...'
                : modalMode === 'add'
                  ? 'Save Employee'
                  : 'Update Employee'
            }}
          </button>

        </div>

      </div>
    </div>
<div
      v-if="showDetailModal"
      class="modal-overlay"
      @click.self="closeDetailModal"
    >
      <div class="modal-container detail-modal">

        <div class="modal-header">

          <div>
            <p class="modal-title text-display">Employee Detail</p>
            <p>Employee information</p>
          </div>

          <button
            class="btn-close"
            @click="closeDetailModal"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>

        </div>

        <div
          v-if="isLoadingDetail"
          class="detail-loading"
        >
          Loading...
        </div>

        <div
          v-else-if="detailEmployee"
          class="detail-body"
        >

          <div class="detail-item">
            <span>Employee ID</span>
            <strong>
              {{ detailEmployee.employee_id }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Name</span>
            <strong>
              {{ detailEmployee.name }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Birth Date</span>
            <strong>
              {{ detailEmployee.birth_date }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Age</span>
            <strong>
              {{ detailEmployee.age }}
            </strong>
          </div>

          <div class="detail-item full-width">
            <span>Address</span>
            <strong>
              {{ detailEmployee.address }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Province</span>
            <strong>
              {{ detailEmployee.province }}
            </strong>
          </div>

          <div class="detail-item">
            <span>City / Regency</span>
            <strong>
              {{ detailEmployee.city }}
            </strong>
          </div>

          <div class="detail-item">
            <span>District</span>
            <strong>
              {{ detailEmployee.district }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Village</span>
            <strong>
              {{ detailEmployee.village }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Position</span>
            <strong>
              {{ detailEmployee.position }}
            </strong>
          </div>

          <div class="detail-item">
            <span>Salary</span>
            <strong>
              Rp {{ formatSalary(detailEmployee.salary) }}
            </strong>
          </div>

          <div class="detail-item full-width">
            <span>Email</span>
            <strong>
              {{ detailEmployee.email }}
            </strong>
          </div>

        </div>

        <div class="modal-footer">
          <button
            class="btn-delete"
            type="button"
            @click="deleteFromDetail"
          >
            Delete
          </button>
          <button
            class="btn-edit"
            type="button"
            @click="editFromDetail"
          >
            Edit
          </button>
        </div>

      </div>
    </div>
    <ModalConfirmDialog
      v-if="showDeleteModal"
      title="Delete Employee?"
      confirm-label="Delete"
      :loading="isDeleting"
      @cancel="closeDeleteModal"
      @confirm="deleteEmployee"
    >
      <p>Are you sure you want to delete <strong>{{ selectedDeleteEmployee?.name }}</strong>?</p>
      <p>This action cannot be undone.</p>
    </ModalConfirmDialog>

  </div>
</template>

<style scoped src="./style.css"></style>
