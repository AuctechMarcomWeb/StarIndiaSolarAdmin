/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
// /* eslint-disable prettier/prettier */
// /* eslint-disable react/prop-types */
// import React from 'react'

// const DescriptionField = ({ formData, setFormData, handleChange }) => {
//   const handleGenerate = () => {
//     const propertyDescriptions = {
//       plot: `A premium open plot offering excellent potential for residential or commercial development. Located in a prime area with easy access to major roads and utilities. Ideal for investors and builders seeking long-term growth and flexibility.`,
//       farmhouse: `A peaceful farmhouse surrounded by nature — perfect for those seeking tranquility and privacy. Designed for comfort with ample space, lush green surroundings, and essential amenities for a relaxed lifestyle. Suitable for weekend getaways or full-time living.`,
//       'villa/banglow': `A luxurious villa/bungalow crafted for modern living. Featuring spacious interiors, elegant design, and premium finishes. Ideal for families who appreciate comfort, privacy, and a high-quality lifestyle in a serene environment.`,
//       apartment: `A beautifully designed apartment offering convenience, style, and comfort. Located in a well-connected neighborhood with modern facilities, elevators, parking, and security. Ideal for professionals and families seeking urban living.`,
//       residential: `A well-planned residential property in a peaceful community. Designed to provide modern amenities, comfort, and accessibility to schools, hospitals, and shopping centers. Perfect for families looking for a comfortable home.`,
//       commercial: `A prime commercial property located in a high-demand business area. Suitable for offices, showrooms, or retail outlets. Offers excellent visibility, accessibility, and investment potential for long-term business success.`,
//     }

//     const type = formData?.propertyType?.toLowerCase()
//     const template = propertyDescriptions[type] || 'Beautiful property available for sale.'

//     const generated = `
// ${formData?.name || 'Property Title'} — ${template}
// Location: ${formData?.address || 'N/A'}
// Area: ${formData?.propertyDetails?.area || 'N/A'} ${formData?.measurementUnit || 'sq. ft.'}
// Price: ₹${formData?.sellingPrice || 'N/A'}
// Contact us for more details!
//     `.trim()

//     setFormData({ ...formData, description: generated })
//   }

//   // ✅ Disable Generate button until all required fields are filled
//   const isGenerateDisabled = !(
//     formData?.propertyType &&
//     formData?.name &&
//     formData?.address &&
//     formData?.sellingPrice &&
//     formData?.propertyDetails?.area
//   )

//   return (
//     <div className="col-md-12 position-relative">
//       <label className="form-label fw-bold">Description *</label>

//       <textarea
//         className="form-control pe-5"
//         name="description"
//         rows={4}
//         required
//         value={formData?.description || ''}
//         onChange={handleChange}
//         placeholder="Property description for click 'Generate'..."
//       />

//       {/* Generate button inside textarea corner */}
//       <button
//         type="button"
//         className="btn btn-sm btn-success position-absolute"
//         onClick={handleGenerate}
//         disabled={isGenerateDisabled}
//         style={{
//           bottom: '10px',
//           right: '10px',
//           zIndex: 2,
//           borderRadius: '8px',
//           fontSize: '12px',
//           padding: '4px 10px',
//         }}
//       >
//         Generate
//       </button>
//     </div>
//   )
// }

// export default DescriptionField

import React, { useState } from 'react'
import { postRequest } from '../Helpers'
import toast from 'react-hot-toast'

const PropertyDescriptions = ({ formData, setFormData, handleChange }) => {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!formData?.name || !formData?.propertyType || !formData?.address) {
      toast.error('Please fill all required fields!')
      return
    }

    setLoading(true)

    try {
      // Prepare payload based on your example
      const payload = {
        address: formData.address,
        addedBy: formData.addedBy || '', // include addedBy if available
        name: formData.name,
        propertyType: formData.propertyType,
        plotCategory: formData.plotCategory || '',
        propertyLocation: formData.propertyLocation || '',
        location: formData.location || null,
        documents: formData.documents || [],
        description: formData.description || '',
        measurementUnit: formData.measurementUnit,
        propertyDetails: formData.propertyDetails,
        status: formData.status || 'Available',
        actualPrice: formData.actualPrice || '',
        sellingPrice: formData.sellingPrice || '',
        facilities: formData.facilities || [],
        services: formData.services || [],
        nearby: formData.nearby || [],
        propertyCode: formData.propertyCode || '',
        bhk: formData.bhk || '',
      }

      const response = await postRequest({
        url: 'ai/ask',
        cred: payload,
      })

      const aiDescription = response?.data?.description || 'Description generated by AI'

      setFormData({ ...formData, description: aiDescription })
      toast.success('Description generated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate description')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Show button only when required fields are filled
  const isFormReady =
    formData?.propertyType &&
    formData?.name &&
    formData?.address &&
    formData?.sellingPrice &&
    formData?.propertyDetails?.area

  const handleAutoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <div className="col-span-2 relative">
      <label className="form-label fw-bold required">Description</label>

      <div className="relative">
        <textarea
          onInput={handleAutoResize}
          className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-20"
          name="description"
          rows={5}
          required
          value={formData?.description || ''}
          onChange={handleChange}
          placeholder="Enter property description"
        />

        <button
          type="button"
          className="btn btn-sm btn-success position-absolute"
          onClick={handleGenerate}
          disabled={!isFormReady || loading}
          style={{
            bottom: '10px',
            right: '10px',
            zIndex: 2,
            borderRadius: '8px',
            fontSize: '12px',
            padding: '4px 10px',
          }}
        >
          {loading ? 'Generating...' : 'Generate'}{' '}
        </button>
      </div>
    </div>
  )
}

export default PropertyDescriptions
