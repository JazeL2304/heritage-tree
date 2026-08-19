'use client';

import React from 'react';
import { TreeConnection } from '@/types/family';

interface TreeConnectorProps {
  connections: TreeConnection[];
}

export const TreeConnector: React.FC<TreeConnectorProps> = ({ connections }) => {
  return (
    <svg
      viewBox="-2000 -2000 6000 6000"
      style={{
        position: 'absolute',
        top: -2000,
        left: -2000,
        width: 6000,
        height: 6000,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 5,
      }}
    >
      <defs>
        {/* Drop Shadow for high contrast pop over grid background */}
        <filter id="connector-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1f1d1d" floodOpacity="0.25" />
        </filter>

        {/* Marriage Ring / Joint Circle Marker */}
        <marker
          id="joint-ring"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
        >
          <circle cx="5" cy="5" r="4" fill="#fed65b" stroke="#8e1616" strokeWidth="2" />
        </marker>

        {/* Downward Child Arrow Marker */}
        <marker
          id="child-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8e1616" stroke="#fed65b" strokeWidth="1" />
        </marker>
      </defs>

      {connections.map((conn) => {
        const isSpouse = conn.type === 'spouse';
        return (
          <g key={conn.id} filter="url(#connector-shadow)">
            {/* White/Parchment thick background stroke for maximum line contrast */}
            <path
              d={conn.path}
              fill="none"
              stroke="#fbf9f5"
              strokeWidth={isSpouse ? '5' : '6'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Main Primary Connector Path Line */}
            <path
              d={conn.path}
              fill="none"
              stroke={isSpouse ? '#735c00' : '#8e1616'}
              strokeWidth={isSpouse ? '3' : '3.5'}
              strokeDasharray={isSpouse ? '5,5' : 'none'}
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
