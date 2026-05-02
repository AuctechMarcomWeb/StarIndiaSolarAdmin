/* eslint-disable no-constant-binary-expression */
import React, { useState } from 'react'
import axios from 'axios'

const LocationSearchInput = ({ value, onSelect, className }) => {
  const [searchTerm, setSearchTerm] = useState(value || '')
  const [places, setPlaces] = useState([])
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [isDropdownClick, setIsDropdownClick] = useState(false)
  const apiKey = 'AIzaSyAQqh6qd0umyH9zAmfsfbVHuMvFcN_m3kQ'
  const url = 'https://places.googleapis.com/v1/places:searchText'

  // 🧹 Clean Plus Code from address
  const cleanAddress = (address) => {
    if (!address) return ''
    if (address.match(/^[A-Z0-9]+\+[A-Z0-9]+/)) {
      return address.substring(address.indexOf(',') + 1).trim()
    }
    return address
  }

  // 🔎 Search Places (Google Places API)
  const handleSearch = async (e) => {
    const val = e.target.value
    setSearchTerm(val)
    setDetailsVisible(true)

    if (val.trim().length < 1) {
      setPlaces([])
      return
    }

    try {
      const response = await axios.post(
        url,
        { textQuery: val },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
          },
        },
      )

      if (response.data?.places) {
        const cleaned = response.data.places.map((p) => ({
          ...p,
          formattedAddress: cleanAddress(p.formattedAddress),
        }))
        setPlaces(cleaned)
      } else {
        setPlaces([])
      }
    } catch (err) {
      console.error('Error fetching places:', err)
      setPlaces([])
    }
  }

  // ✅ Dropdown select

  // const handlePlaceSelect = (place) => {
  //   const formatted = cleanAddress(place.formattedAddress)
  //   setSearchTerm(formatted)
  //   setDetailsVisible(false)

  //   onSelect({
  //     address: formatted,
  //     location: {
  //       type: 'Point',
  //       coordinates: [place.location.longitude, place.location.latitude],
  //     },
  //   })
  // }

  const handlePlaceSelect = (place) => {
    const formatted = cleanAddress(place.formattedAddress)
    const lat = place.location?.latitude || null
    const lng = place.location?.longitude || null

    setSearchTerm(formatted)
    setDetailsVisible(false)

    onSelect({
      address: formatted,
      location: lat && lng ? { type: 'Point', coordinates: [lng, lat] } : null,
    })
  }

  // ✅ Manual typing
  const handleManualSelect = () => {
    if (searchTerm.trim() !== '') {
      onSelect({
        address: searchTerm.trim(),
        location: null,
      })
    }
  }

  return (
    <div className="location-container position-relative">
      {/* Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onBlur={() => {
          if (!isDropdownClick) {
            handleManualSelect() // only manual typing
          }
          setDetailsVisible(false)
        }}
        placeholder="Search location or address"
        className="form-control"
        required
        // className={`w-full p-4 border border-gray-300 rounded-xl outline-none ${className || ''}`}
      />
      {/* Suggestions Dropdown */}
      {detailsVisible && places.length > 0 && (
        <div className="absolute bg-white shadow w-full z-10 max-h-60 overflow-auto">
          {places.map((place, idx) => (
            <div
              key={idx}
              onMouseDown={() => handlePlaceSelect(place)} // use onMouseDown
              className="cursor-pointer py-2 px-3 hover:bg-gray-100 text-sm"
            >
              <p className="font-medium">{place.displayName?.text}</p>
              <p className="text-gray-600">{place.formattedAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationSearchInput
