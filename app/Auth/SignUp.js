import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import FormField from './FormField'
import FormAlert from './FormAlert'
import Spinner from './Spinner'

const Schema = yup.object({
  email: yup.string().email().required().label('Email'),
  user_name: yup.string().min(1).max(15).required().label('UserName'),
  password: yup.string().min(1).max(15).required().label('Password'),
})

const SignUp = () => {
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (form, { resetForm }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/createuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const info = await res.json()
      setIsError(!info.success)
      setMessage(info.message)
      if (info.success) resetForm()
    } catch (e) {
      setIsError(true)
      setMessage("Something went wrong — try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full px-8">
      <Formik validationSchema={Schema} initialValues={{ email: '', password: '', user_name: '' }} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleSubmit: submitForm }) => (
          <form onSubmit={submitForm}>
            <FormAlert message={message} isError={isError} />

            <FormField
              id="user_name"
              label="USERNAME"
              value={values.user_name}
              onChange={handleChange('user_name')}
              error={errors.user_name}
              touched={touched.user_name}
            />

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
                className="bg-red-600 hover:bg-red-500 transition-colors w-full font-semibold py-3 rounded-md text-white cursor-pointer"
              >
                SIGN UP
              </button>
            )}
          </form>
        )}
      </Formik>
    </div>
  )
}

export default SignUp