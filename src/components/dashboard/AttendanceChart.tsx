"use client";

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'จ.', มาเรียน: 300, ขาด: 10, สาย: 10 },
  { name: 'อ.', มาเรียน: 305, ขาด: 8, สาย: 7 },
  { name: 'พ.', มาเรียน: 295, ขาด: 15, สาย: 10 },
  { name: 'พฤ.', มาเรียน: 310, ขาด: 5, สาย: 5 },
  { name: 'ศ.', มาเรียน: 290, ขาด: 20, สาย: 10 },
];

export default function AttendanceChart() {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          onMouseMove={(state: any) => {
            if (state && state.activeTooltipIndex !== undefined) {
              setActiveIndex(state.activeTooltipIndex);
            } else {
              setActiveIndex(-1);
            }
          }}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: 'var(--text-muted)', fontSize: 13}} 
          />
          <Tooltip 
            cursor={{fill: 'rgba(0,0,0,0.04)'}}
            contentStyle={{
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '12px 16px',
              fontFamily: 'inherit'
            }}
            itemStyle={{ fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} 
            iconType="circle"
          />
          <Bar dataKey="มาเรียน" stackId="a" fill="#4caf50" radius={[0, 0, 8, 8]} barSize={40}>
            {data.map((_entry, index) => (
              <Cell key={`cell-0-${index}`} opacity={activeIndex === index || activeIndex === -1 ? 1 : 0.6} style={{ transition: 'opacity 0.2s' }} />
            ))}
          </Bar>
          <Bar dataKey="สาย" stackId="a" fill="#f57f17">
            {data.map((_entry, index) => (
              <Cell key={`cell-1-${index}`} opacity={activeIndex === index || activeIndex === -1 ? 1 : 0.6} style={{ transition: 'opacity 0.2s' }} />
            ))}
          </Bar>
          <Bar dataKey="ขาด" stackId="a" fill="#e53935" radius={[8, 8, 0, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`cell-2-${index}`} opacity={activeIndex === index || activeIndex === -1 ? 1 : 0.6} style={{ transition: 'opacity 0.2s' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
