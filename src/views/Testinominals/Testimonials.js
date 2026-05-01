/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Hash,
  Settings,
  Star,
  FileText,
  Tag,
} from 'lucide-react'
import ExportButton from '../ExportButton'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import axios from 'axios'
import TestimonialsModals from './TestimonialsModals'
import GalleryFilters from '../Gallery/GalleryFilters'
import watermark from '../../assets/logo.png'

const Testimonials = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filters, setFilters] = useState({})
  const [tempFilters, setTempFilters] = useState(filters)
  const [expandedAddresses, setExpandedAddresses] = React.useState({})

  const toggleAddress = (id) => {
    setExpandedAddresses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  // Fetch testimonials with Pagination + Search
  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()
    getRequest(`testimonials?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.testimonials || [])
        setTotal(responseData?.totalTestimonials || 0)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, updateStatus, filters])

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

  // ✅ Delete handler
  const confirmDelete = () => {
    setLoading(true)
    deleteRequest(`testimonials/${selectedItem?._id}`)
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
    <div className=" bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
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
          <h2 className="text-xl sm:text-2xl font-semibold text-[#008235]">Testimonials</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Testimonials</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* <ExportButton data={visibleData} fileName="Testimonials.xlsx" sheetName="Testimonials" /> */}
          <button
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="bg-[#008325] text-white px-3 sm:px-4 py-2 hover:bg-[#E63946] flex items-center justify-center  text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Testimonials
          </button>
        </div>
      </div>
      {/* Search */}
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
      <div className=" relative overflow-x-auto">
        {/* WATERMARK BACKGROUND */}

        {loading ? (
          // Loader
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">
              Loading Testinominals...
            </div>
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
                  <th className="px-3 py-3 border border-gray-300 ">
                    <div className="flex items-center justify-center gap-2">
                      {/* <Hash className="w-4 h-4" /> */}
                      <span>Sr. No.</span>
                    </div>
                  </th>

                  <th className="px-3 py-3 border border-gray-300 ">
                    <div className="flex items-center justify-center gap-2">
                      {/* <Tag className="w-4 h-4" /> */}
                      <span>Name</span>
                    </div>
                  </th>

                  <th className="px-3 py-3 border border-gray-300 ">
                    <div className="flex items-center justify-center gap-2">
                      {/* <FileText className="w-4 h-4" /> */}
                      <span>Comment</span>
                    </div>
                  </th>

                  <th className="px-3 py-3 border border-gray-300 ">
                    <div className="flex items-center justify-center gap-2">
                      {/* <Star className="w-4 h-4" /> */}
                      <span>Rating</span>
                    </div>
                  </th>
                  {/* Status */}
                  <th className="px-3 py-3 border border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      {/* <ImageIcon className="w-4 h-4" /> */}
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 border border-gray-300 ">
                    <div className="flex items-center justify-center gap-2">
                      {/* <Settings className="w-4 h-4" /> */}
                      <span>Actions</span>
                    </div>
                  </th>
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

                    {/* TITLE with IMAGE */}
                    <td className="py-2 border border-gray-300 text-gray-800 pl-3">
                      <div
                        className="
      flex flex-col items-center gap-2 
      sm:flex-row sm:items-left sm:gap-3
    "
                      >
                        <img
                          src={
                            item?.profileImage ||
                            'https://res.cloudinary.com/dusw7izfx/image/upload/v1765350319/jbnsbx9lxttvmnxh2wjo.png'
                          }
                          alt="testimonials"
                          className="w-12 h-12 rounded-lg object-cover border s"
                          onError={(e) =>
                            (e.currentTarget.src =
                              'https://res.cloudinary.com/dusw7izfx/image/upload/v1765350319/jbnsbx9lxttvmnxh2wjo.png')
                          }
                        />
                        <span className="font-medium text-gray-800">{item?.title}</span>
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-3 py-3 border border-gray-300 text-gray-800 text-left">
                      <Tooltip title={item?.description} placement="topLeft">
                        <span className="inline-block w-full whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                          {item?.description?.split(' ')?.slice(0, 3)?.join(' ') || '-'}
                          {item?.description?.split(' ')?.length > 3 ? '…' : ''}
                        </span>
                      </Tooltip>
                    </td>

                    {/* RATING */}
                    <td className="px-3 py-3 border border-gray-300">{item?.rating || '-'}</td>
                    {/* Status */}
                    <td className=" border border-gray-300  text-gray-800 text-center py-2">
                      {item?.isActive ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          Inactive
                        </span>
                      )}{' '}
                    </td>
                    {/* ACTIONS */}
                    <td className="px-3 py-3 border border-gray-300">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setIsModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-800"
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

      {/* ✅ Pagination (only show if there’s data) */}
      {!loading && data?.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              pageSizeOptions={['5', '10', '20', '50', '100', '200', '500', '1000']}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
              showQuickJumper
            />
          </div>
        </div>
      )}
      {isModalOpen && (
        <TestimonialsModals
          setUpdateStatus={setUpdateStatus}
          setModalData={setSelectedItem}
          modalData={selectedItem}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default Testimonials
