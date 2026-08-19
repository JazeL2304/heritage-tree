'use client';

import React from 'react';
import { TreeConnection } from '@/types/family';

interface TreeConnectorProps {
  connections: TreeConnection[];
}

export const TreeConnector: React.FC<TreeConnectorProps> = ({ connections }) => {
  return (
    <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3D3731" />
        </marker>
      </defs>

      {connections.map((conn) => (
        <path
          key={conn.id}
          d={conn.path}
          fill="none"
          stroke="#3D3731"
          strokeWidth={conn.type === 'spouse' ? '2' : '2'}
          strokeDasharray={conn.type === 'spouse' ? '5,5' : 'none'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};
