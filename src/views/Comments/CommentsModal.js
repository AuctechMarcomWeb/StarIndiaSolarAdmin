/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { postRequest, putRequest } from '../../Helpers'

const CommentsModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData.name || '',
        email: modalData.email || '',
        message: modalData.message || '',
        isActive: modalData.isActive ?? true,
      })
    } else {
      setFormData({ name: '', email: '', message: '', isActive: true })
    }
  }, [modalData])

  const handleCancel = () => {
    setFormData({ name: '', email: '', message: '', isActive: true })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    postRequest({ url: 'comments', cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Comment added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => toast.error(error?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    putRequest({ url: `comments/${modalData?._id}`, cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Comment updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => toast.error(error?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Comment' : 'Add Comment'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      destroyOnClose
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        <div className="row">
          {/* Name */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold" htmlFor="name">
              Name<span className="text-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold" htmlFor="email">
              Email<span className="text-danger">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        {/* Message */}
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="message">
            Message<span className="text-danger">*</span>
          </label>
          <textarea
            id="message"
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter message"
          ></textarea>
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>

        {/* isActive */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label fw-bold" htmlFor="isActive">
            Active
          </label>
        </div>

        {/* Submit */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn text-white"
            style={{ backgroundColor: loading ? '#6c757d' : '#008325' }}
          >
            {loading ? 'Saving...' : modalData ? 'Update' : 'Add Comment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CommentsModal
