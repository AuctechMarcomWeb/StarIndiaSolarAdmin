/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { postRequest, putRequest } from '../../Helpers'

const ContactsModal = ({
  setUpdateStatus,
  modalData,
  isModalOpen,
  setIsModalOpen,
  setModalData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  /* ---------- Edit Mode Data ---------- */
  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData?.name || '',
        email: modalData?.email || '',
        phone: modalData?.phone || '',
        subject: modalData?.subject || '',
        message: modalData?.message || '',
      })
    } else {
      resetForm()
    }
  }, [modalData])

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setModalData(null)
    setIsModalOpen(false)
  }

  /* ---------- Handle Change ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target

    // Phone: only numbers, max 10 digits
    if (name === 'phone' && !/^\d{0,10}$/.test(value)) return

    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  /* ---------- Validation ---------- */
  const validateForm = () => {
    let newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (formData.phone.length !== 10) newErrors.phone = 'Enter valid 10 digit phone'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ---------- Add Contact ---------- */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    postRequest({ url: `contact`, cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Contact added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => setLoading(false))
  }

  /* ---------- Edit Contact ---------- */
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    putRequest({
      url: `contact/${modalData?._id}`,
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Contact updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Contact' : 'Add Contact'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit}>
        <div className="row g-3">
          {/* Name */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="name">
              Name<span className="text-danger">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="email">
              Email<span className="text-danger">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="phone">
              Phone<span className="text-danger">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          {/* Subject */}
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="subject">
              Subject<span className="text-danger">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
            />
            {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
          </div>

          {/* Message */}
          <div className="col-12">
            <label className="form-label fw-bold" htmlFor="message">
              Message<span className="text-danger">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter message"
            />
            {errors.message && <div className="invalid-feedback">{errors.message}</div>}
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn !bg-[#c01e0f] !text-white !border-none hover:!bg-[#c01e0f]"
            disabled={loading}
          >
            {loading ? (modalData ? 'Updating...' : 'Saving...') : modalData ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ContactsModal
