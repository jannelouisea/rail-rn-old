import createContextProvider from './createContextProvider'
import AsyncStorage from '@react-native-community/async-storage'
import railapi from '../api/rail'

const ACTION_TYPES = {
  ADD_ERROR: 'add_error',
  SIGNIN: 'signin',
  SIGNUP: 'signup',
  RESTORE_TOKEN: 'restore_token',
}

const accountReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SIGNUP:
      return { ...state, token: action.payload, error: '' }
    case ACTION_TYPES.SIGNIN:
      return { ...state, token: action.payload, error: '' }
    case ACTION_TYPES.RESTORE_TOKEN:
      return { ...state, token: action.payload, error: '' }
    case ACTION_TYPES.ADD_ERROR:
      return { ...state, error: action.payload }
    default:
      return state
  }
}

// function for signup
// payload: {name, email, username, usastate, password}
const signup = (dispatch) => async (payload) => {
  try {
    const response = await railapi.post('/signup', payload)
    await AsyncStorage.setItem('@token', response.data.accessToken) // TODO: Change this value when connecting with backend
    // TODO: Should cache account information??

    // Need the dispatch payload to include: name, username, email, usastate, token, error
    // TODO: Instead of doing this, hopefully the backend will return this information along with the token
    /*
    const newState = {
      name: payload.name,
      username: payload.username,
      email: payload.email,
      usastate: payload.usastate,
      token: response.data.accessToken,
      error: '',
    }*/

    dispatch({ type: ACTION_TYPES.SIGNUP, payload: response.data.accessToken })
  } catch (err) {
    dispatch({
      type: ACTION_TYPES.ADD_ERROR,
      payload: 'Something went wrong with sign up',
    })
  }
}

// payload: {email: String, password: String}
const signin = (dispatch) => async (payload) => {
  try {
    const response = await railapi.post('/login', payload)
    await AsyncStorage.setItem('@token', response.data.accessToken) // TODO: Change this value when connecting with backend

    // TODO: Get saved account information in cache??
    dispatch({ type: ACTION_TYPES.SIGNIN, payload: response.data.accessToken })
  } catch (err) {
    dispatch({
      type: ACTION_TYPES.ADD_ERROR,
      payload: 'Email/Username and or Password is incorrect',
    })
  }
}

const restoreToken = (dispatch) => async () => {
  try {
    const token = await AsyncStorage.getItem('@token')
    dispatch({ type: ACTION_TYPES.RESTORE_TOKEN, payload: token })
  } catch (err) {
    // Restore token failed
  }
}

// function for signout

const defaultValue = {
  name: '',
  username: '',
  email: '',
  usastate: '',
  token: null,
  error: '',
}

export const { Context, Provider } = createContextProvider(
  accountReducer,
  { signup, signin, restoreToken },
  defaultValue
)
