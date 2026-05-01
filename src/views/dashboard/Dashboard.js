/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { BookOpen, MessageSquareQuote, Images, ImagePlus, PhoneCall, LogIn } from 'lucide-react'
import { Empty, Spin } from 'antd'
import { getRequest } from '../../Helpers'
import { useNavigate } from 'react-router-dom'

// ---------------------------------
// ⭐ Animated Number
// ---------------------------------
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value || 0
    const duration = 1000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return <span>{display.toLocaleString()}</span>
}

// ---------------------------------
// ⭐ Stat Card
// ---------------------------------
function StatCard({ title, value, icon: Icon, color, active, bgColor, delay, onClick }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovegreen, setIsHovegreen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ripple = { x, y, id: Date.now() }
    setRipples([...ripples, ripple])
    setIsClicked(true)

    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== ripple.id))
    }, 600)

    setTimeout(() => setIsClicked(false), 200)
    // 👉 navigate call
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovegreen(true)}
      onMouseLeave={() => setIsHovegreen(false)}
      className={`
        rounded-xl px-6 py-4 shadow-md border-t-4 border-t-[#008235]
        relative overflow-hidden cursor-pointer transition-all duration-500 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isClicked ? 'scale-95' : isHovegreen ? 'scale-[1.03] shadow-xl' : ''}
      `}
    >
      {/* Ripple */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-[#008235] opacity-40 animate-ripple"
          style={{ left: r.x, top: r.y, width: 0, height: 0 }}
        />
      ))}

      {/* Shine */}
      {isHovegreen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.44), transparent)',
            animation: 'shine 1.2s linear',
          }}
        />
      )}

      {/* Content */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-800 font-semibold">{title}</p>
          <p
            className={`text-4xl font-semibold mt-1 ${isHovegreen ? 'text-gray-500' : 'text-[#008235]'}`}
          >
            <AnimatedNumber value={value} />
          </p>
          {active !== undefined && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{active}</span> Active
              </span>
            </div>
          )}
        </div>

        <div
          className={`${bgColor} p-3 rounded-full`}
          style={{
            animation: isVisible ? 'bounce 2s infinite' : 'none',
            transform: isHovegreen ? 'scale(1.25) rotate(10deg)' : 'scale(1)',
          }}
        >
          <Icon className={`${color} w-7 h-7`} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------
// ⭐ Colgo Foods Dashboard
// ---------------------------------
export default function ColgoDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)

    getRequest(`dashboard`)
      .then((res) => {
        const responseData = res?.data?.data
        setDashboardData(responseData || [])
        console.log('Dashboard Data:', res)
      })
      .catch((error) => {
        console.error('Dashboard API Error:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="flex flex-col items-center py-20">
        <Spin size="large" />
        <div className="mt-4 text-blue-500 font-medium">Loading Dashboard...</div>
      </div>
    )

  if (!dashboardData)
    return (
      <div className="flex justify-center py-20">
        <Empty description="No dashboard data found" />
      </div>
    )

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ripple {
          to {
            width: 400px;
            height: 400px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>

      <div className="px-4 py-4">
        {/* <h2 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h2> */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 bg-gradient-to-r from-[#008235] to-[#008235] bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">Monitor your content and engagement metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Blogs"
            value={dashboardData.blogs.totalBlogs}
            active={dashboardData.blogs.activeBlogs}
            icon={BookOpen}
            color="text-green-600"
            bgColor="bg-green-100"
            delay={0}
            onClick={() => navigate('/blogs')}
          />

          <StatCard
            title="Testimonials"
            value={dashboardData.testimonials.totalTestimonials}
            active={dashboardData.testimonials.activeTestimonials}
            icon={MessageSquareQuote}
            color="text-green-600"
            bgColor="bg-green-100"
            delay={120}
            onClick={() => navigate('/testimonials')}
          />
          <StatCard
            title="Gallery"
            value={dashboardData.gallery.totalGalleryItems}
            active={dashboardData.gallery.activeGalleryItems}
            icon={ImagePlus}
            color="text-green-600"
            bgColor="bg-green-100"
            delay={360}
            onClick={() => navigate('/gallery')}
          />

          <StatCard
            title="Contacts"
            value={dashboardData.contacts.totalContacts}
            icon={PhoneCall}
            color="text-green-600"
            bgColor="bg-green-100"
            delay={480}
            onClick={() => navigate('/contacts')}
          />
        </div>
      </div>
    </>
  )
}
