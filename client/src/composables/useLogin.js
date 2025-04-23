import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const error = ref(null)
const isPending = ref(false)

const login = async (email, password) => {

  error.value = null
  isPending.value = true

  try {
    
    const res = await axios.post('http://localhost:3000/api/users/login', {
      email: email.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(`Logged in user: ${email.value}`)

    error.value = null
    isPending.value = false

    return res
    
  } catch (err) {
    isPending.value = false

    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'An unexpected error occurred. Please try again.'
    }
  }
}

const useLogin = () => {
  return { email, password, error, isPending, login }
}

export default useLogin