/* eslint-disable prettier/prettier */
import React from 'react'
import { Modal } from 'antd'

const BlogViewModal = ({ isModalOpen, setIsModalOpen, modalData }) => {
  if (!modalData) return null
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      title="View Blog"
      footer={null}
      width={800}
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <span className="font-semibold">Title: </span>
          <span>{modalData.title}</span>
        </div>

        {/* Image */}
        <div>
          <span className="font-semibold">Image: </span>
          <img
            src={modalData.image}
            alt={modalData.title}
            className="w-full h-60 object-cover rounded mt-2"
          />
        </div>

        {/* Excerpt */}
        <div>
          <span className="font-semibold">Short Description: </span>
          <p className="text-gray-600 mt-1">{modalData.excerpt}</p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
          <div>
            <span className="font-semibold">Category: </span>
            <span>{modalData.category}</span>
          </div>
          <div>
            <span className="font-semibold">Author: </span>
            <span>
              {modalData.author} ({modalData.authorRole})
            </span>
          </div>
          <div>
            <span className="font-semibold">Read Time: </span>
            <span>{modalData.readTime}</span>
          </div>
          <div>
            <span className="font-semibold">Date: </span>
            <span>{formatDate(modalData.date)}</span>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-4">
          <span className="font-semibold">Introduction: </span>
          <p className="mt-1">{modalData.content?.intro}</p>
        </div>

        {/* Sections */}
        {modalData.content?.sections
          ?.filter((section) => section?.heading?.trim() !== '' || section?.text?.trim() !== '')
          .map((sec, i) => (
            <div key={i} className="mt-4">
              <span className="font-semibold">{sec.heading}: </span>
              <p className="text-gray-700 mt-1">{sec.text}</p>
            </div>
          ))}

        {/* Conclusion */}
        <div className="mt-4">
          <span className="font-semibold">Conclusion: </span>
          <p>{modalData.content?.conclusion}</p>
        </div>
      </div>
    </Modal>
  )
}

export default BlogViewModal
