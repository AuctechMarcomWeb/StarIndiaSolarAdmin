/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { Row, Col, Input, Checkbox, Button, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const BlogFilters = ({
  searchTerm,
  setSearchTerm,
  tempFilters,
  setTempFilters,
  applyFilters,
  resetFilters,
  page,
}) => {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Filters</h3>

      <Row gutter={[16, 16]} align="middle">
        {/* Search */}
        <Col xs={24} sm={12} lg={6}>
          <label className="fw-medium mb-1 d-block">Search</label>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => {
              page(1)
              setSearchTerm(e.target.value)
            }}
          />
        </Col>

        {/* Category */}
        {/* <Col xs={24} sm={12} lg={6}>
          <label className="fw-medium mb-1 d-block">Category</label>
          <Select
            placeholder="Select Category"
            allowClear
            value={tempFilters.category || undefined}
            className="w-100"
            onChange={(value) => {
              page(1)
              setTempFilters((prev) => ({
                ...prev,
                category: value || '',
              }))
            }}
            options={[
              { label: 'Tech', value: 'tech' },
              { label: 'Health', value: 'health' },
              { label: 'Business', value: 'business' },
              { label: 'Lifestyle', value: 'lifestyle' },
            ]}
          />
        </Col> */}

        {/* Active */}
        <Col xs={24} sm={12} lg={4} style={{ marginTop: 22 }}>
          <Checkbox
            checked={tempFilters.isActive}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, isActive: e.target.checked }))}
          >
            Active
          </Checkbox>
        </Col>

        {/* Buttons */}
        <Col xs={24} sm={12} lg={8}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 22,
            }}
          >
            <Button
              type="primary"
              onClick={applyFilters}
              style={{
                backgroundColor: '#008235',
                borderColor: '#008235',
                color: '#fff',
              }}
            >
              Apply
            </Button>

            <Button
              onClick={resetFilters}
              style={{
                backgroundColor: '#6b7785',
                borderColor: '#6b7785',
                color: '#fff',
              }}
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default BlogFilters
