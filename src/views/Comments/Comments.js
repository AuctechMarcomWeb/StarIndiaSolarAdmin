/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { deleteRequest, getRequest, putRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import CommentsModal from './CommentsModal'
import GalleryFilters from '../Gallery/GalleryFilters'

const Comments = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filters, setFilters] = useState({})
  const [tempFilters, setTempFilters] = useState({})

  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()
    getRequest(`comments?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.comments || [])
        setTotal(responseData?.totalComments || 0)
      })
      .catch((error) => console.log('error', error))
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, updateStatus, filters])

  const applyFilters = () => {
    setFilters(tempFilters)
    setPage(1)
  }

  const resetFilters = () => {
    setTempFilters({})
    setFilters({})
    setPage(1)
    setSearchTerm('')
  }

  const handleToggleStatus = (item) => {
    putRequest({ url: `comments/${item._id}`, cred: { isActive: !item.isActive } })
      .then((res) => {
        toast.success(res?.data?.message || 'Status updated')
        setUpdateStatus((prev) => !prev)
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to update status'))
  }

  const confirmDelete = () => {
    setLoading(true)
    deleteRequest(`comments/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-white">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete comment by <strong>{selectedItem?.name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className={`px-6 py-2 text-white transition-all duration-300 ${
                  loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-2 sm:px-2 py-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#008235]">Comments</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Blog Comments</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#008325] text-white px-3 sm:px-4 py-2 hover:bg-[#E63946] flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Comment
          </button>
        </div>
      </div>

      {/* Filters */}
      <GalleryFilters
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        page={setPage}
      />

      {/* Table */}
      <div className="relative overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Comments...</div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Empty description="No comments found" />
          </div>
        ) : (
          <>
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden table-fixed">
              <thead className="bg-[#008325] text-white">
                <tr className="text-center">
                  <th className="px-3 py-3 border border-gray-300">Sr. No.</th>
                  <th className="px-3 py-3 border border-gray-300">Name</th>
                  <th className="px-3 py-3 border border-gray-300">Email</th>
                  <th className="px-3 py-3 border border-gray-300">Blog</th>
                  <th className="px-3 py-3 border border-gray-300">Message</th>
                  <th className="px-3 py-3 border border-gray-300">Status</th>
                  <th className="px-3 py-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {data.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-3 border border-gray-300">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="px-3 py-3 border border-gray-300 text-gray-800">{item.name}</td>
                    <td className="px-3 py-3 border border-gray-300 text-gray-600">{item.email}</td>
                    <td className="px-3 py-3 border border-gray-300 text-gray-600 text-sm">
                      {item.blogId?.heading || item.blogId?.seoTitle || '—'}
                    </td>
                    <td className="px-3 py-3 border border-gray-300 text-gray-700 text-sm text-left max-w-xs">
                      <Tooltip title={item.message}>
                        <span className="line-clamp-2 block">{item.message}</span>
                      </Tooltip>
                    </td>
                    <td className="px-3 py-3 border border-gray-300">
                      <span
                        onClick={() => handleToggleStatus(item)}
                        className={`cursor-pointer px-2 py-1 text-xs font-semibold rounded-full ${
                          item.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-3 border border-gray-300">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip title="Edit">
                          <button
                            onClick={() => {
                              setModalData(item)
                              setIsModalOpen(true)
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setShowDeleteModal(true)
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end mt-4 px-4 pb-4">
              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
                onChange={(p, l) => {
                  setPage(p)
                  setLimit(l)
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <CommentsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalData={modalData}
        setModalData={setModalData}
        setUpdateStatus={setUpdateStatus}
      />
    </div>
  )
}

export default Comments
