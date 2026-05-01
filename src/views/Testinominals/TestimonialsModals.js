/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../Helpers'

const TestimonialsModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  // ✅ State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    profileImage: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // ✅ Prefill data in Edit mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        title: modalData.title || '',
        description: modalData.description || '',
        rating: modalData.rating || '',
        profileImage: modalData.profileImage || '',
        isActive: modalData.isActive ?? true,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        rating: '',
        profileImage: '',
        isActive: true,
      })
    }
  }, [modalData])

  // ✅ Close modal and reset state
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      rating: '',
      profileImage: '',
      isActive: true,
    })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // ✅ Clear error for that field when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  // ✅ Handle image upload
  const handleChangeImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    fileUpload({
      url: 'upload/uploadImage',
      cred: { file },
    })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          profileImage: res?.data?.data?.imageUrl,
        }))
        toast.success(res?.data?.message || 'Image uploaded successfully')
        // ✅ image upload hote hi error clear
        setErrors((prev) => ({
          ...prev,
          profileImage: '',
        }))
        setLoading(false)
      })
      .catch((error) => {
        console.error('Image upload failed:', error)
        toast.error(error?.response?.data?.message || 'Image upload failed')
      })
      .finally(() => setLoading(false))
  }

  // ✅ Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: '' }))
  }

  // ✅ Validate form fields
  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'description is required'
    if (!formData.rating) newErrors.rating = 'Rating is required'
    if (!formData.profileImage) newErrors.profileImage = 'Profile image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Add new testimonial
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    postRequest({
      url: 'testimonials',
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Testimonial added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  // ✅ Update existing testimonial
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    putRequest({
      url: `testimonials/${modalData?._id}`,
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Testimonial updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  const handleRemoveProfileImage = () => {
    setFormData({ ...formData, profileImage: '' })
  }

  return (
    <Modal
      title={modalData ? 'Edit Testimonial' : 'Add Testimonial'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      destroyOnClose
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        <div className="row">
          {/* Title */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold" htmlFor="name">
              Name<span className="text-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Name"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          {/* Rating */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold" htmlFor="rating">
              Rating (1–5)<span className="text-danger">*</span>
            </label>
            <input
              id="rating"
              type="number"
              name="rating"
              min={1}
              max={5}
              step={1}
              className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
              value={formData.rating}
              placeholder="Enter 1–5 rating"
              onChange={(e) => {
                const value = e.target.value

                // allow empty (delete case)
                if (value === '') {
                  setFormData({ ...formData, rating: '' })
                  return
                }

                const num = Number(value)

                // restrict 1–5
                if (num < 1 || num > 5) return

                setFormData({ ...formData, rating: num })
                setErrors({ ...errors, rating: '' })
              }}
            />

            {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
          </div>
        </div>

        {/* Description (full width) */}
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="comment">
            Comment<span className="text-danger">*</span>
          </label>
          <textarea
            id="comment"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter your comment"
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        {/* Image Upload + Preview */}
        <div className="col-md-12">
          <label className="form-label fw-bold" htmlFor="image">
            Image<span className="text-danger">*</span>
          </label>

          <div className="d-flex align-items-center gap-3">
            <input
              id="image"
              type="file"
              className={`form-control ${errors.profileImage ? 'is-invalid' : ''}`}
              style={{ width: formData.profileImage ? '70%' : '100%' }}
              accept="image/*"
              onChange={handleChangeImage}
            />

            {formData.profileImage && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={formData.profileImage}
                  alt="preview"
                  className="rounded border"
                  style={{
                    width: '90px',
                    height: '70px',
                    objectFit: 'cover',
                  }}
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleRemoveProfileImage}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    lineHeight: '16px',
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {loading && <small className="text-info">Uploading...</small>}
          {errors.profileImage && (
            <div className="invalid-feedback d-block">{errors.profileImage}</div>
          )}
        </div>

        {/* Active Checkbox */}
        <div className="col-md-8 d-flex align-items-center">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              id="isActive"
            />
            <label className="form-check-label" htmlFor="isActive">
              Active
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn !bg-[#008235] !text-white !border-none hover:!bg-[#008235]"
            disabled={loading}
          >
            {modalData ? (loading ? 'Updating...' : 'Update ') : loading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TestimonialsModal
