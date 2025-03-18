import axios from 'axios'
import { reactive, ref } from "vue";

const formData = reactive({
  firstName: '',
  lastName: '',
  prefix: '',
  email: '',
  password: ''
})

const error = ref(null)
const isPending = ref(false)

const signUp = async () => {

  error.value = null
  isPending.value = true

  try {
    const res = await axios.post('http://localhost:3000/api/users/signup', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      prefix: formData.prefix,
      email: formData.email,
      password: formData.password
    })
    console.log('Sign up successful')

    error.value = null
    isPending.value = false

    return res

  } catch (err) {
    
    isPending.value = false

    console.log(err.message)

    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'An unexpected error occurred. Please try again.'
    }
  }
}


const useSignUp = () => {
  return { formData, error, isPending, signUp }
}

export default useSignUp