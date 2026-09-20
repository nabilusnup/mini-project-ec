import Swal from 'sweetalert2'

export const showAlert = options => Swal.fire({
  timer: 2200,
  timerProgressBar: true,
  showConfirmButton: false,
  ...options
})
