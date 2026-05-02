/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Settings,
  ImageIcon,
  Hash,
  Tag,
} from 'lucide-react'
import ExportButton from '../ExportButton'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import GalleryModal from './GalleryModal'
import watermark from '../../assets/logo.png'
import GalleryFilterses from './GalleryFilterses'

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})
  const [tempFilters, setTempFilters] = useState(filters)

  // Fetch Gallery with Pagination + Search
  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()
    getRequest(`gallery?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.gallery || [])
        setTotal(responseData?.totalGallery || 0)
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

  // Confirm Delete
  const confirmDelete = () => {
    setLoading(true)
    deleteRequest(`gallery/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => setLoading(false))
  }
  const getServiceTypeLabel = (type) => {
    const map = {
      gallery: 'Media',
      news: 'News',
      event_media: 'Event',
      we_care: 'We Care',
    }
    return map[type] || '-'
  }

  return (
    <div className="bg-white">
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
          <h2 className="text-xl sm:text-2xl font-semibold text-[#008235] ">Gallery</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Gallery</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* <ExportButton data={visibleData} fileName="Gallery.xlsx" sheetName="Gallery" /> */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#008235] text-white px-3 sm:px-4 py-2 hover:bg-[#E63946] flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Gallery
          </button>
        </div>
      </div>

      {/* Search */}
      <GalleryFilterses
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
        {/* <div
          className="
            absolute 
            inset-0 
            pointer-events-none 
            opacity-20
            w-full h-full      
            z-0
          "
          style={{
            backgroundImage: `url(${watermark})`,
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div> */}
        {loading ? (
          // Loader
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Gallery...</div>
          </div>
        ) : !data || data.length === 0 ? (
          // Empty state
          <div className="flex justify-center items-center py-20">
            <Empty description="No testimonials found" />
          </div>
        ) : (
          <>
            {/* Table */}
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden table-fixed">
              {/* HEADER */}
              <thead className="bg-[#008325] text-white">
                <tr className="text-center">
                  <th className="px-3 py-3 border border-gray-300">Sr. No.</th>
                  <th className="px-3 py-3 border border-gray-300">Image</th>
                  {/* <th className="px-3 py-3 border border-gray-300">Category Type</th> */}
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

                    {/* IMAGE */}
                    <td className="py-2 border border-gray-300">
                      <div className="flex justify-center">
                        <img
                          src={
                            item?.url ||
                            'https://res.cloudinary.com/dusw7izfx/image/upload/v1765350319/jbnsbx9lxttvmnxh2wjo.png'
                          }
                          alt="service"
                          className="w-12 h-12 rounded-lg object-cover border"
                          onError={(e) =>
                            (e.currentTarget.src =
                              'https://res.cloudinary.com/dusw7izfx/image/upload/v1765350319/jbnsbx9lxttvmnxh2wjo.png')
                          }
                        />
                      </div>
                    </td>

                    {/* CATEGORY TYPE */}
                    {/* <td className="px-3 py-3 border border-gray-300">
                      <span className="font-medium text-gray-800">
                        {getServiceTypeLabel(item?.serviceType) || '-'}
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
                      <div className="flex justify-center gap-3">
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
      {!loading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total.length}{' '}
              results
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={data.length}
              pageSizeOptions={['5', '10', '20', '50']}
              onChange={setPage}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <GalleryModal
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

export default Gallery
