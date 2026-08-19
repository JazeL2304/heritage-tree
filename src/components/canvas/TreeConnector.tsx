'use client';

import React from 'react';
import { TreeConnection } from '@/types/family';

interface TreeConnectorProps {
  connections: TreeConnection[];
}

export const TreeConnector: React.FC<TreeConnectorProps> = ({ connections }) => {
  return (
    <svg
      style={{
        position: 'absolute',
        top: -1000,
        left: -2000,
        width: 4000,
        height: 4000,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1,
      }}
    >
      <defs>
        {/* Glow Filter for Gold Connection Lines */}
        <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Parent-Child Downward Arrow Marker */}
        <marker
          id="arrow-down"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8e1616" stroke="#fed65b" strokeWidth="1" />
        </marker>

        {/* Joint Dot Marker */}
        <marker
          id="dot-joint"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
        >
          <circle cx="5" cy="5" r="4" fill="#fed65b" stroke="#8e1616" strokeWidth="2" />
        </marker>
      </defs>

      {connections.map((conn) => {
        const isSpouse = conn.type === 'spouse';
        return (
          <g key={conn.id}>
            {/* Outer Glow / Background Stroke for High Visibility */}
            <path
              d={conn.path}
              fill="none"
              stroke="#fbf9f5"
              strokeWidth={isSpouse ? '5' : '6'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />

            {/* Main Primary Connector Path Line */}
            <path
              d={conn.path}
              fill="none"
              stroke={isSpouse ? '#735c00' : '#8e1616'}
              strokeWidth={isSpouse ? '3' : '3.5'}
              strokeDasharray={isSpouse ? '6,6' : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={isSpouse ? 'url(#dot-joint)' : 'url(#arrow-down)'}
              filter="url(#line-glow)"
            />
          </g>
        );
      })}
    </svg>
  );
};
