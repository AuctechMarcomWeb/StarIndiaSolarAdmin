/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Hash,
  Image as ImageIcon,
  User,
  Settings,
} from 'lucide-react'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import BlogModal from './BlogModal'
import BlogFilters from './BlogFilters' // You can create a BlogFilters component similar to GalleryFilters
import watermark from '../../assets/logo.png'
import BlogViewModal from './BlogViewModal'

const Blog = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [tempFilters, setTempFilters] = useState(filters)

  // Fetch blogs with pagination, search, and filters
  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()

    getRequest(`blogs?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.blogs || [])
        console.log('DFdsf', responseData)

        setTotal(responseData?.totalBlogs || 0)
        console.log('Blogs Lists', responseData?.blogs)
      })
      .catch(() => toast.error('Failed to fetch blogs'))
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, filters, updateStatus])

  // Apply filters
  const applyFilters = () => {
    setFilters(tempFilters)
    setPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {}
    setTempFilters(defaultFilters)
    setFilters(defaultFilters)
    setPage(1)
    setSearchTerm('')
  }

  // Confirm delete
  const confirmDelete = () => {
    setLoading(true)
    deleteRequest(`blogs/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch(() => toast.error('Delete failed'))
      .finally(() => setLoading(false))
  }
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }
  const formatTimeOnly = (date) => {
    if (!date) return '-'

    return new Date(date)
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace(/\s?(am|pm)/i, (m) => m.toUpperCase())
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className={`px-6 py-2 text-white 
    transition-all duration-300
    ${loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
  `}
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
          <h2 className="text-xl sm:text-2xl font-semibold text-[#008235]">Blogs</h2>
          <p className="text-gray-600 text-sm">Manage blog articles</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null)
            setIsModalOpen(true)
          }}
          className="bg-[#008325] text-white px-4 py-2 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Blog
        </button>
      </div>

      {/* Filters */}
      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        page={setPage}
      />

      {/* Table */}
      <div className=" relative overflow-x-auto">
        {loading ? (
          // Loader
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Blog...</div>
          </div>
        ) : !data || data.length === 0 ? (
          // Empty state
          <div className="flex justify-center items-center py-20">
            <Empty description="No testimonials found" />
          </div>
        ) : (
          <>
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden table-fixed">
              {/* HEADER */}
              <thead className="bg-[#008325] text-white">
                <tr className="text-center">
                  <th className="px-3 py-3 border border-gray-300">Sr. No.</th>
                  <th className="px-3 py-3 border border-gray-300">Blog</th>
                  <th className="px-3 py-3 border border-gray-300">Blog Url</th>
                  <th className="px-3 py-3 border border-gray-300">Short Description</th>
                  {/* <th className="px-3 py-3 border border-gray-300">Comments</th> */}
                  <th className="px-3 py-3 border border-gray-300">Status</th>
                  <th className="px-3 py-3 border border-gray-300">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {data.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    {/* SR NO */}
                    <td className="px-3 py-3 border border-gray-300">
                      {(page - 1) * limit + (index + 1)}
                    </td>

                    {/* BLOG (IMAGE + TITLE) */}
                    <td className="py-2 border border-gray-300 text-left pl-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item?.mainImage || 'https://via.placeholder.com/150'}
                          alt={item?.mainImageName}
                          className="w-14 h-10 rounded object-cover border"
                        />
                        <Tooltip title={item?.heading} placement="topLeft">
                          <span className="font-medium text-gray-800 inline-block max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                            {item?.heading || '-'}
                          </span>
                        </Tooltip>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-3 py-3 border border-gray-300 text-left">
                      {item?.url || '-'}
                    </td>
                    <td className="border px-3 py-2 text-left">
                      <Tooltip
                        placement="topLeft" // you can adjust placement
                        overlayStyle={{
                          maxWidth: '500px',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                        }} // make tooltip content wrap
                        title={item?.shortDescription || '-'}
                      >
                        <div className="line-clamp-2 break-words cursor-pointer">
                          {item?.shortDescription || '-'}
                        </div>
                      </Tooltip>
                    </td>
                    {/* <td className="px-3 py-3 border border-gray-300">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {item?.commentCount ?? 0}
                      </span>
                    </td> */}

                    {/* STATUS */}
                    <td className="border border-gray-300 py-2">
                      {item?.isActive ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-3 py-3 border border-gray-300">
                      <div className="flex justify-center gap-2">
                        {/* <button
                          onClick={() => setViewModal(item)}
                          className="text-green-600 hover:text-green-800"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button> */}

                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setIsModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              pageSizeOptions={['5', '10', '20', '50']}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <BlogModal
          modalData={selectedItem}
          setModalData={setSelectedItem}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setUpdateStatus={setUpdateStatus}
        />
      )}

      {/* View Modal */}
      {viewModal && (
        <BlogViewModal
          isModalOpen={true}
          setIsModalOpen={() => setViewModal(false)}
          modalData={viewModal}
        />
      )}
    </div>
  )
}

export default Blog
