import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { state } from '../store'
import FormField from './FormField'
import FormAlert from './FormAlert'
import Spinner from './Spinner'

const Schema = yup.object({
  email: yup.string().email().required().label('Email'),
  password: yup.string().min(1).max(15).required().label('Password'),
})

const Login = () => {
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (form, { resetForm }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const info = await res.json()
      setIsError(!info.success)
      setMessage(info.message)
      if (info.success) {
        state.log = true
        state.signUp = false
        resetForm()
      }
    } catch (e) {
      setIsError(true)
      setMessage("Something went wrong — try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full px-6">
      <Formik validationSchema={Schema} initialValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleSubmit: submitForm }) => (
          <form onSubmit={submitForm}>
            <FormAlert message={message} isError={isError} />

            <FormField
              id="email"
              label="EMAIL"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
              touched={touched.email}
            />

            <FormField
              id="password"
              label="PASSWORD"
              type="password"
              placeholder="•••••"
              value={values.password}
              onChange={handleChange('password')}
              error={errors.password}
              touched={touched.password}
            />

            {loading ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 transition-colors w-full py-3 rounded-md font-semibold text-white cursor-pointer"
              >
                LOG IN
              </button>
            )}
          </form>
        )}
      </Formik>
    </div>
  )
}

export default Login