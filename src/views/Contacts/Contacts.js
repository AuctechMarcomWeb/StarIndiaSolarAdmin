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
  Mail,
  Phone,
  FileText,
} from 'lucide-react'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import ContactsModal from './ContactsModal'
import watermark from '../../assets/logo.png'
import ContactsFilters from './ContactsFilters'

const Contacts = () => {
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
  /* ---------- Fetch Contacts ---------- */
  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()

    getRequest(`contact?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.contacts || [])
        setTotal(responseData?.totalContacts || 0)
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, updateStatus])
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
  /* ---------- Delete ---------- */
  const confirmDelete = () => {
    setLoading(true)
    deleteRequest(`contact/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message || 'Contact deleted')
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
        setSelectedItem(null)
      })
      .catch((err) => toast.error(err?.response?.data?.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-white">
      {/* ---------- Delete Modal ---------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
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

      {/* ---------- Header ---------- */}
      <div className="px-2 sm:px-2 py-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#008235]">Contacts</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Contacts</p>
        </div>
        {/* <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={visibleData} fileName="Testimonials.xlsx" sheetName="Testimonials" />
          <button
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="bg-[#008325] text-white px-3 sm:px-4 py-2 hover:bg-[#E63946] flex items-center justify-center  text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Contact
          </button>
        </div> */}
      </div>
      {/* Search */}
      <ContactsFilters
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        page={setPage}
      />
      {/* ---------- Table ---------- */}
      <div className="relative overflow-x-auto">
        {/* WATERMARK BACKGROUND */}

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500">Loading Contacts...</div>
          </div>
        ) : !data.length ? (
          <div className="flex justify-center py-20">
            <Empty description="No contacts found" />
          </div>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden table-fixed">
            {/* HEADER */}
            <thead className="bg-[#008325] text-white">
              <tr className="text-center">
                <th className="px-3 py-3 border border-gray-300 ">
                  <div className="flex items-center justify-center gap-2 ">
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
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-3 py-3 border border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    {/* <ImageIcon className="w-4 h-4" /> */}
                    <span>Phone</span>
                  </div>
                </th>
                <th className="px-3 py-3 border border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    {/* <ImageIcon className="w-4 h-4" /> */}
                    <span>Subject</span>
                  </div>
                </th>
                <th className="px-3 py-3 border border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    {/* <ImageIcon className="w-4 h-4" /> */}
                    <span>Message</span>
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

            <tbody className="text-center bg-white">
              {data.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{(page - 1) * limit + index + 1}</td>
                  <td className="border px-3 py-2 text-left">{item?.name}</td>
                  <td className="border px-3 py-2 text-left">{item?.email}</td>
                  <td className="border px-3 py-2 text-left">{item?.phone}</td>

                  <td className="border px-3 py-2 text-left">
                    <Tooltip title={item?.subject}>
                      <span className="truncate block cursor-pointer">
                        {item?.subject?.split(' ')?.slice(0, 3)?.join(' ') || '-'}
                        {item?.subject?.split(' ')?.length > 3 ? '…' : ''}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="border px-3 py-2 text-left">
                    <Tooltip
                      placement="topLeft" // you can adjust placement
                      overlayStyle={{
                        maxWidth: '500px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }} // make tooltip content wrap
                      title={item?.message || '-'}
                    >
                      <div className="line-clamp-2 break-words cursor-pointer">
                        {item?.message || '-'}
                      </div>
                    </Tooltip>
                  </td>

                  <td className="border px-3 py-2">
                    <div className="flex justify-center gap-3">
                      {/*<button
                        onClick={() => {
                          setSelectedItem(item)
                          setIsModalOpen(true)
                        }}
                        className="text-blue-600"
                      >
                        <Edit className="w-5 h-5" />
                      </button>*/}
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600"
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

      {/* ---------- Pagination ---------- */}
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

      {/* ---------- Modal ---------- */}
      {isModalOpen && (
        <ContactsModal
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

export default Contacts
