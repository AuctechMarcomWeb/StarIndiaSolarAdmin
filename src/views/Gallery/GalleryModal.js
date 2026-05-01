/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../Helpers'

const GalleryModal = ({
  setUpdateStatus,
  modalData,
  isModalOpen,
  setIsModalOpen,
  setModalData,
}) => {
  const [formData, setFormData] = useState({
    // title: '',
    url: '',
    serviceType: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Edit mode data set
  useEffect(() => {
    if (modalData) {
      setFormData({
        // title: modalData?.title || '',
        url: modalData?.url || '',
        serviceType: modalData?.serviceType || '',
        isActive: modalData?.isActive ?? true,
      })
    } else {
      setFormData({
        // title: '',
        url: '',
        serviceType: '',
        isActive: true,
      })
    }
  }, [modalData])

  const handleCancel = () => {
    setFormData({
      // title: '',
      url: '',
      isActive: true,
    })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // Image Upload
  const handleImageUpload = (e) => {
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
          url: res?.data?.data?.imageUrl,
        }))
        toast.success(res?.data?.message || 'Image uploaded successfully')
        // ✅ image upload hote hi error clear
        setErrors((prev) => ({
          ...prev,
          url: '',
        }))
        setLoading(false)
      })
      .catch((error) => {
        console.error('Image upload failed:', error)
        toast.error(error?.response?.data?.message || 'Image upload failed')
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

    // if (!formData.title.trim()) newErrors.title = 'Title required'
    if (!formData.url) newErrors.url = 'Image required'
    // if (!formData.serviceType) newErrors.serviceType = 'Service type required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add Gallery
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    postRequest({ url: 'gallery', cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Gallery added')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Edit Gallery
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    putRequest({ url: `gallery/${modalData?._id}`, cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Gallery updated')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => {
        setLoading(false)
      })
  }
  const handleRemoveImage = () => {
    setFormData({ ...formData, url: '' })
  }

  return (
    <Modal
      title={modalData ? 'Edit Gallery' : 'Add Gallery'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit}>
        <div className="row g-3">
          {/* Image Upload + Preview */}
          <div className="col-md-12">
            <label className="form-label fw-bold" htmlFor="image">
              Image<span className="text-danger">*</span>
            </label>

            <div className="d-flex align-items-center gap-3">
              <input
                id="image"
                type="file"
                className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                style={{ width: formData.url ? '70%' : '100%' }}
                accept="image/*"
                onChange={handleImageUpload}
              />

              {formData.url && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={formData.url}
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
            {errors.url && <div className="invalid-feedback d-block">{errors.url}</div>}
          </div>
          {/* Title */}
          {/* <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="title">
              Title<span className="text-danger">*</span>
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
          </div> */}

          {/* Service Type Select */}
          {/* <div className="col-md-12">
            <label className="form-label fw-bold" htmlFor="service">
              Category Type<span className="text-danger">*</span>
            </label>
            <Select
              id="service"
              showSearch
              placeholder="Select Service Type"
              value={formData.serviceType}
              className={errors.serviceType ? 'ant-select-status-error w-100' : 'w-100'}
              onChange={(value) => setFormData({ ...formData, serviceType: value })}
              options={[
                { label: 'Selct Type', value: '' },
                { label: 'Media', value: 'gallery' },
                { label: 'News', value: 'news' },
                { label: 'Event', value: 'event_media' },
                { label: 'We Care', value: 'we_care' },
              ]}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
            {errors.serviceType && <small className="text-danger">{errors.serviceType}</small>}
          </div> */}
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

export default GalleryModal
