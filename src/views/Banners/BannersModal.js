/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../Helpers'

const BannersModal = ({
  setUpdateStatus,
  modalData,
  isModalOpen,
  setIsModalOpen,
  setModalData,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    subHeading: '',
    image: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Edit mode data set
  useEffect(() => {
    if (modalData) {
      setFormData(modalData)
    } else {
      setFormData({
        title: '',
        heading: '',
        subHeading: '',
        image: '',
        isActive: true,
      })
    }
  }, [modalData])

  const handleCancel = () => {
    setFormData({
      title: '',
      heading: '',
      subHeading: '',
      image: '',
      isActive: true,
    })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setLoading(true)

    fileUpload({
      url: 'upload/uploadImage',
      cred: { file },
    })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          image: res?.data?.data?.imageUrl,
        }))
        toast.success(res?.data?.message || 'Image uploaded successfully')
        // ✅ image upload hote hi error clear
        setErrors((prev) => ({
          ...prev,
          image: '',
        }))
        setLoading(false)
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Image upload failed')
        console.error('Image upload failed:', error)
        setLoading(false)
      })
  }

 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    setErrors({ ...errors, [name]: '' })
  }

  // Validation
  const validateForm = () => {
    let newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title required'
    if (!formData.heading.trim()) newErrors.heading = 'Heading required'
    if (!formData.subHeading.trim()) newErrors.subHeading = 'Sub heading required'
    if (!formData.image) newErrors.image = 'Image required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add Banner
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    postRequest({ url: `homeSlider`, cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Banner added')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => {
        setLoading(false)
      })
  }

  // Edit Banner
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    putRequest({ url: `homeSlider/${modalData?._id}`, cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Banner updated')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => {
        setLoading(false)
      })
  }
  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' })
  }

  return (
    <Modal
      title={modalData ? 'Edit Banner' : 'Add Banner'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit}>
        <div className="row g-3">
          {/* Title */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="title">
              Title<span className="text-danger"> *</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Title"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          {/* Heading */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="heading">
              Heading<span className="text-danger"> *</span>
            </label>
            <input
              id="heading"
              type="text"
              name="heading"
              className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
              value={formData.heading}
              onChange={handleChange}
              placeholder="Enter Heading"
            />
            {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
          </div>

          {/* Sub Heading */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="subHeading">
              Sub Heading<span className="text-danger"> *</span>
            </label>
            <input
              id="subHeading"
              type="text"
              name="subHeading"
              className={`form-control ${errors.subHeading ? 'is-invalid' : ''}`}
              value={formData.subHeading}
              onChange={handleChange}
              placeholder="Enter Sub Heading"
            />
            {errors.subHeading && <div className="invalid-feedback">{errors.subHeading}</div>}
          </div>

          {/* Image Upload + Preview */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="image">
              Image<span className="text-danger"> *</span>
            </label>

            <div className="d-flex align-items-center gap-3">
              {/* File input */}
              <input
                id="image"
                type="file"
                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                style={{ width: formData.image ? '65%' : '100%' }}
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Preview with Close Button */}
              {formData.image && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={formData.image}
                    alt="preview"
                    className="rounded border"
                    style={{
                      width: '110px',
                      height: '65px',
                      objectFit: 'cover',
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
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
            {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}
          </div>

          {/* Active Checkbox */}
          <div className="col-md-6 d-flex align-items-center mt-2">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                id="isActive"
              />
              <label className="form-check-label fw-semibold" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn !bg-[#008325] !text-white !border-none hover:!bg-[#008325]"
            disabled={loading}
          >
            {loading ? (modalData ? 'Updating...' : 'Saving...') : modalData ? 'Update' : 'Save'}{' '}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default BannersModal
