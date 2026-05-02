/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../Helpers'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'

const INITIAL_STATE = {
  url: '',
  heading: '',
  seoTitle: '',
  metaKeywords: '',
  shortDescription: '',
  mainImage: '',
  mainImageName: '',
  multipleImages: [],
  details: '',
  isActive: true,
}

const BlogModal = ({ setUpdateStatus, setModalData, modalData, isModalOpen, setIsModalOpen }) => {
  const [formData, setFormData] = useState(INITIAL_STATE)
  console.log('formData', formData)

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [mainImageLoading, setMainImageLoading] = useState(false)
  const [multiImageLoading, setMultiImageLoading] = useState(false)
  const mainImageRef = useRef(null)
  const multiImageRef = useRef(null)

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (modalData) {
      setFormData({
        url: modalData.url || '',
        heading: modalData.heading || '',
        seoTitle: modalData.seoTitle || '',
        metaKeywords: modalData.metaKeywords || '',
        shortDescription: modalData.shortDescription || '',
        mainImage: modalData.mainImage || '',
        mainImageName: modalData.mainImageName || '',
        multipleImages: modalData.multipleImages || [],
        details: modalData.details || '',
        isActive: modalData.isActive ?? true,
      })
    } else {
      setFormData(INITIAL_STATE)
    }
  }, [modalData])

  /* ================= CLOSE MODAL ================= */
  const handleCancel = () => {
    setFormData(INITIAL_STATE)
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  const validateImageType = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG & WEBP images are allowed')
      return false
    }
    return true
  }

  /* ================= MAIN IMAGE ================= */
  const handleMainImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!validateImageType(file)) {
      e.target.value = ''
      return
    }

    setMainImageLoading(true)

    fileUpload({
      url: 'upload/uploadImage',
      cred: { file },
    })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          mainImage: res?.data?.data?.imageUrl,
          mainImageName: file.name,
        }))
        toast.success('Main image uploaded')
      })
      .catch(() => toast.error('Image upload failed'))
      .finally(() => setMainImageLoading(false))
  }

  const removeMainImage = () => {
    setFormData((prev) => ({
      ...prev,
      mainImage: '',
      mainImageName: '',
    }))

    // 🔹 Clear input value
    if (mainImageRef.current) mainImageRef.current.value = ''
  }

  /* ================= MULTIPLE IMAGES ================= */
  const handleMultipleImages = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setMultiImageLoading(true)
    const uploaded = []

    for (const file of files) {
      if (!validateImageType(file)) continue

      try {
        const res = await fileUpload({
          url: 'upload/uploadImage',
          cred: { file },
        })
        uploaded.push(res?.data?.data?.imageUrl)
      } catch {
        toast.error('One image failed')
      }
    }

    setFormData((prev) => ({
      ...prev,
      multipleImages: [...prev.multipleImages, ...uploaded],
    }))

    setMultiImageLoading(false)
  }

  const removeMultipleImage = () => {
    setFormData((prev) => ({
      ...prev,
      multipleImages: [],
    }))

    if (multiImageRef.current) multiImageRef.current.value = ''
  }

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {}

    if (!formData.url) newErrors.url = 'URL is required'
    if (!formData.heading) newErrors.heading = 'Heading is required'
    if (!formData.seoTitle) newErrors.seoTitle = 'SEO title is required'
    if (!formData.metaKeywords) newErrors.metaKeywords = 'Meta keywords required'
    if (!formData.shortDescription) newErrors.shortDescription = 'Short description required'
    if (!formData.details || formData.details === '<p><br></p>') {
      newErrors.details = 'Blog details is required'
    }
    if (!formData.mainImage) newErrors.mainImage = 'Main image required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const apiCall = modalData
      ? putRequest({ url: `blogs/${modalData._id}`, cred: formData })
      : postRequest({ url: 'blogs', cred: formData })

    apiCall
      .then((res) => {
        toast.success(res?.data?.message || 'Blog saved successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch(() => toast.error('Something went wrong'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Blog' : 'Add Blog'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={900}
      destroyOnClose
    >
      <form onSubmit={handleSubmit}>
        {/* URL & Heading */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Blog URL<span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${errors?.url ? 'is-invalid' : ''}`}
              name="url"
              value={formData?.url}
              onChange={handleChange}
              placeholder="Enter Blog Url"
            />
            {errors?.url && <div className="invalid-feedback">{errors?.url}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Blog Heading<span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${errors?.heading ? 'is-invalid' : ''}`}
              name="heading"
              value={formData?.heading}
              onChange={handleChange}
              placeholder="Enter Blog Heading"
            />
            {errors?.heading && <div className="invalid-feedback">{errors?.heading}</div>}
          </div>
        </div>

        {/* SEO */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Blog Title(SEO)<span className="text-danger">*</span>
            </label>
            <textarea
              rows="2"
              className={`form-control ${errors?.seoTitle ? 'is-invalid' : ''}`}
              name="seoTitle"
              value={formData?.seoTitle}
              onChange={handleChange}
              placeholder="Enter Blog SEO Title"
            />
            {errors?.seoTitle && <div className="invalid-feedback">{errors?.seoTitle}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Blog Short Description<span className="text-danger">*</span>
            </label>
            <textarea
              rows="2"
              className={`form-control ${errors?.shortDescription ? 'is-invalid' : ''}`}
              name="shortDescription"
              value={formData?.shortDescription}
              onChange={handleChange}
              placeholder="Enter Blog Short Description"
            />
            {errors?.shortDescription && (
              <div className="invalid-feedback">{errors?.shortDescription}</div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Blog Meta Keywords<span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${errors?.metaKeywords ? 'is-invalid' : ''}`}
              name="metaKeywords"
              value={formData?.metaKeywords}
              onChange={handleChange}
              placeholder="Enter MetaKeywords"
            />
            {errors?.metaKeywords && <div className="invalid-feedback">{errors?.metaKeywords}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Main Image Name<span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${errors?.mainImageName ? 'is-invalid' : ''}`}
              name="mainImageName"
              value={formData?.mainImageName}
              onChange={handleChange}
              placeholder="Enter Main Image Name"
            />
            {errors?.mainImageName && (
              <div className="invalid-feedback">{errors?.mainImageName}</div>
            )}
          </div>
        </div>

        <div className="row">
          {/* ================= MAIN IMAGE ================= */}
          <div className="col-md-6 mb-3">
            <label className="fw-bold">
              Main Image<span className="text-danger">*</span>
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="form-control"
              onChange={handleMainImage}
              ref={mainImageRef}
            />

            {mainImageLoading && <small className="text-info">Uploading main image...</small>}

            {formData?.mainImage && !mainImageLoading && (
              <div
                className="mt-2 position-relative d-inline-block"
                style={{ width: 120, height: 80 }}
              >
                <img
                  src={formData?.mainImage}
                  alt="main"
                  width={120}
                  height={80}
                  style={{ objectFit: 'cover' }}
                  className="border rounded"
                />

                <button
                  type="button"
                  onClick={removeMainImage}
                  className="position-absolute"
                  style={{
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* ================= MULTIPLE IMAGES ================= */}
          <div className="col-md-6 mb-3">
            <label className="fw-bold">Multiple Images</label>

            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="form-control"
              onChange={handleMultipleImages}
              ref={multiImageRef}
            />

            {multiImageLoading && <small className="text-info">Uploading images...</small>}

            <div className="d-flex gap-2 mt-2 flex-wrap">
              {formData?.multipleImages.map((img, i) => (
                <div key={i} className="position-relative">
                  <img
                    src={img}
                    width={90}
                    height={70}
                    style={{ objectFit: 'cover' }}
                    className="border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeMultipleImage(i)}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS — SUNEDITOR */}
        <div className="mb-3">
          <label className="fw-bold">
            Blog Details<span className="text-danger">*</span>
          </label>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <SunEditor
              height="300px"
              setContents={formData?.details}
              onChange={(content) => {
                setFormData((prev) => ({ ...prev, details: content }))
                setErrors((prev) => ({ ...prev, details: '' }))
              }}
              setOptions={{
                buttonList: [
                  ['undo', 'redo'],
                  ['bold', 'italic', 'underline'],
                  ['fontSize', 'formatBlock'],
                  ['fontColor', 'hiliteColor'],
                  ['align', 'list', 'table'],
                  ['link', 'image', 'video'],
                  ['removeFormat'],
                ],
              }}
            />
          </div>

          {errors?.details && <div className="text-danger mt-1">{errors?.details}</div>}
        </div>

        {/* Active */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="isActive"
            checked={formData?.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label">Active</label>
        </div>

        {/* Buttons */}
        <div className="text-end">
          <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn !bg-[#008325] !text-white !border-none hover:!bg-[#008325]"
            disabled={loading}
          >
            {loading ? 'Saving...' : modalData ? 'Update Blog' : 'Publish Blog'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default BlogModal
