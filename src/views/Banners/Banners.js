/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import BannersModal from './BannersModal'
import BannersFilters from './BannersFilters'
import watermark from '../../assets/logo.png'

const Banners = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filters, setFilters] = useState({})
  const [tempFilters, setTempFilters] = useState(filters)

  // ✅ Fetch Banner with Pagination + Search
  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()
    getRequest(`homeSlider?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.sliders || [])
        setTotal(responseData?.totalSliders || 0)
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

  // Delete handler
  const confirmDelete = () => {
    setLoading(true)
    deleteRequest(`homeSlider/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message || 'Deleted successfully')
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.title}</strong>?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
          <h2 className="text-xl sm:text-2xl font-semibold text-[#008235]">Banner</h2>
          <p className="text-gray-600">Manage homepage banners.</p>
        </div>

        <button
          onClick={() => {
            setSelectedItem(null)
            setIsModalOpen(true)
          }}
          className="bg-[#008235] text-white px-3 sm:px-4 py-2 hover:bg-[#E63946] flex items-center justify-center  text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Search */}
      <BannersFilters
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        page={setPage}
      />

      {/* Table */}
      <div className="overflow-x-auto relative">
        {/* WATERMARK BACKGROUND */}
        {/* <div
          className="
                    absolute 
                    inset-0 
                    pointer-events-none 
                    opacity-20
                    w-full h-full  
                    z-0"
          style={{
            backgroundImage: `url(${watermark})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div> */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium">Loading Banners...</div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden table-fixed">
            {/* HEADER */}
            <thead className="bg-[#008235] text-white">
              <tr className="text-center">
                <th className="px-3 py-3 border border-gray-300">Sr. No.</th>
                <th className="px-3 py-3 border border-gray-300">Banner</th>
                <th className="px-3 py-3 border border-gray-300">Main Heading</th>
                <th className="px-3 py-3 border border-gray-300">Sub Heading</th>
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
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* BANNER (IMAGE + TITLE) */}
                  <td className="py-2 border border-gray-300 text-left pl-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item?.image ||
                          'https://res.cloudinary.com/dusw7izfx/image/upload/v1765350319/jbnsbx9lxttvmnxh2wjo.png'
                        }
                        alt="banner"
                        className="w-14 h-10 rounded object-cover border"
                      />

                      <Tooltip title={item?.title} placement="topLeft">
                        <span className="font-medium text-gray-800 inline-block max-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                          {item?.title || '-'}
                        </span>
                      </Tooltip>
                    </div>
                  </td>

                  {/* MAIN HEADING */}
                  <td className="px-3 py-3 border border-gray-300 text-left">
                    <Tooltip title={item?.heading} placement="topLeft">
                      <span className="inline-block max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                        {item?.heading || '-'}
                      </span>
                    </Tooltip>
                  </td>

                  {/* SUB HEADING */}
                  <td className="px-3 py-3 border border-gray-300 text-left">
                    <Tooltip title={item?.subHeading} placement="topLeft">
                      <span className="inline-block max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                        {item?.subHeading || '-'}
                      </span>
                    </Tooltip>
                  </td>

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
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="px-6 py-4 flex justify-between">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
          </div>

          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={(newPage) => setPage(newPage)}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setLimit(size)
              setPage(1)
            }}
          />
        </div>
      )}

      {isModalOpen && (
        <BannersModal
          setUpdateStatus={setUpdateStatus}
          modalData={selectedItem}
          setModalData={setSelectedItem}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default Banners
