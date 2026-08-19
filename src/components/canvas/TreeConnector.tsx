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
      {connections.map((conn) => (
        <g key={conn.id}>
          {/* Simple Solid Dark Line (3px Charcoal Black, Clean 90-degree Orthogonal) */}
          <path
            d={conn.path}
            fill="none"
            stroke="#1f1d1d"
            strokeWidth="3.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </g>
      ))}
    </svg>
  );
};
