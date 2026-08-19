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
        top: -3000,
        left: -3000,
        width: 8000,
        height: 8000,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 5,
      }}
      viewBox="-3000 -3000 8000 8000"
    >
      <defs>
        {/* Marriage Joint Ring Marker */}
        <marker
          id="joint-ring"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="10"
          markerHeight="10"
        >
          <circle cx="6" cy="6" r="5" fill="#d4af37" stroke="#1f1d1d" strokeWidth="2" />
        </marker>

        {/* Downward Child Arrow Marker */}
        <marker
          id="child-arrow"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 12 6 L 0 11 z" fill="#8e1616" stroke="#d4af37" strokeWidth="1.5" />
        </marker>
      </defs>

      {connections.map((conn) => {
        const isSpouse = conn.type === 'spouse';
        return (
          <g key={conn.id}>
            {/* Outer Contrast Outline (Dark Gold/Brown Glow) */}
            <path
              d={conn.path}
              fill="none"
              stroke="#fed65b"
              strokeWidth={isSpouse ? '7' : '7'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Core Primary Line (Thick Cinnabar Red / Dark Charcoal) */}
            <path
              d={conn.path}
              fill="none"
              stroke={isSpouse ? '#8e1616' : '#8e1616'}
              strokeWidth={isSpouse ? '4' : '4'}
              strokeDasharray={isSpouse ? '6,4' : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={isSpouse ? 'url(#joint-ring)' : 'url(#child-arrow)'}
            />
          </g>
        );
      })}
    </svg>
  );
};
