import { FamilyMember, TreeConnection } from '@/types/family';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'm_patriarch',
    surname: 'Li',
    givenName: 'Jianhua',
    gender: 'male',
    birthDate: '1960-03-15',
    isDeceased: false,
    title: 'Patriarch (Gen 1)',
    generation: 1,
    isVerified: true,
    spouseId: 'm_matriarch',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Senior Scholar of the Imperial Lineage',
  },
  {
    id: 'm_matriarch',
    surname: 'Wang',
    givenName: 'Xiu Ying',
    gender: 'female',
    birthDate: '1962-08-22',
    isDeceased: false,
    title: 'Matriarch (Gen 1)',
    generation: 1,
    isVerified: true,
    spouseId: 'm_patriarch',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    notes: 'Archival Custodian',
  },
  {
    id: 'm_subject',
    surname: 'Li',
    givenName: 'Wei',
    gender: 'male',
    birthDate: '1994-04-07',
    isDeceased: false,
    title: 'Head of Branch (Gen 2)',
    generation: 2,
    isVerified: true,
    fatherId: 'm_patriarch',
    motherId: 'm_matriarch',
    spouseId: 'm_spouse',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    notes: 'Active subject of the current family ledger.',
  },
  {
    id: 'm_sister',
    surname: 'Li',
    givenName: 'Mei',
    gender: 'female',
    birthDate: '1996-11-12',
    isDeceased: false,
    title: 'Gen 2',
    generation: 2,
    isVerified: true,
    fatherId: 'm_patriarch',
    motherId: 'm_matriarch',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: 'Junior Scholar',
  },
  {
    id: 'm_spouse',
    surname: 'Chen',
    givenName: 'Ting',
    gender: 'female',
    birthDate: '1995-02-18',
    isDeceased: false,
    title: 'Partner (Gen 2)',
    generation: 2,
    isVerified: true,
    spouseId: 'm_subject',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    notes: 'Partner in Lineage Record',
  },
  {
    id: 'm_child',
    surname: 'Li',
    givenName: 'An',
    gender: 'male',
    birthDate: '2020-09-05',
    isDeceased: false,
    title: 'Gen 3 Heir',
    generation: 3,
    isVerified: true,
    fatherId: 'm_subject',
    motherId: 'm_spouse',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    notes: 'Direct 3rd generation descendant.',
  },
];

/**
 * Calculates (x,y) layout coordinates for all members in the tree and classic family tree connections
 */
export function calculateTreePositions(members: FamilyMember[]): {
  positionedMembers: FamilyMember[];
  connections: TreeConnection[];
} {
  const NODE_WIDTH = 160;
  const NODE_HEIGHT = 150;
  const LEVEL_SPACING = 150;
  const SIBLING_SPACING = 60;

  // Compute generation depth for each member
  const depthMap = new Map<string, number>();

  function getDepth(m: FamilyMember, visited = new Set<string>()): number {
    if (visited.has(m.id)) return depthMap.get(m.id) || 1;
    visited.add(m.id);

    if (m.generation) return m.generation;

    if (m.fatherId || m.motherId) {
      const parentId = m.fatherId || m.motherId;
      const parent = members.find((p) => p.id === parentId);
      if (parent) {
        const parentDepth = getDepth(parent, visited);
        return parentDepth + 1;
      }
    }

    if (m.spouseId) {
      const spouse = members.find((s) => s.id === m.spouseId);
      if (spouse && spouse.id !== m.id) {
        if (depthMap.has(spouse.id)) return depthMap.get(spouse.id)!;
      }
    }

    return 1;
  }

  members.forEach((m) => {
    depthMap.set(m.id, getDepth(m));
  });

  // Group by level
  const levels = new Map<number, FamilyMember[]>();
  members.forEach((m) => {
    const depth = depthMap.get(m.id) || 1;
    if (!levels.has(depth)) levels.set(depth, []);
    levels.get(depth)!.push(m);
  });

  const positionedMembers: FamilyMember[] = [];
  const connections: TreeConnection[] = [];

  const sortedLevels = Array.from(levels.keys()).sort((a, b) => a - b);

  sortedLevels.forEach((level) => {
    const levelMembers = levels.get(level)!;
    const totalWidth = levelMembers.length * (NODE_WIDTH + SIBLING_SPACING) - SIBLING_SPACING;
    const startX = -totalWidth / 2;

    levelMembers.forEach((m, idx) => {
      const x = startX + idx * (NODE_WIDTH + SIBLING_SPACING);
      const y = (level - 1) * (NODE_HEIGHT + LEVEL_SPACING);
      positionedMembers.push({ ...m, x, y });
    });
  });

  // 1. Compute Spouse Marriage Connections (Horizontal line between couples)
  positionedMembers.forEach((m) => {
    if (m.spouseId) {
      const spouse = positionedMembers.find((s) => s.id === m.spouseId);
      if (spouse && m.id < spouse.id && m.x !== undefined && m.y !== undefined && spouse.x !== undefined && spouse.y !== undefined) {
        const leftMember = m.x < spouse.x ? m : spouse;
        const rightMember = m.x < spouse.x ? spouse : m;

        const startX = (leftMember.x || 0) + NODE_WIDTH;
        const endX = rightMember.x || 0;
        const lineY = (leftMember.y || 0) + 60; // Middle height of member card

        const path = `M ${startX} ${lineY} L ${endX} ${lineY}`;
        connections.push({
          id: `spouse_${m.id}_${spouse.id}`,
          fromId: m.id,
          toId: spouse.id,
          type: 'spouse',
          path,
        });
      }
    }
  });

  // 2. Compute Parent-Child Connections (Classic Family Tree Branch: Marriage Midpoint -> Vertical Drop -> T-Bar -> Children)
  // Group children by parent couple / single parent
  const familyGroups = new Map<string, FamilyMember[]>();

  positionedMembers.forEach((m) => {
    if (m.fatherId || m.motherId) {
      const parentKey = [m.fatherId, m.motherId].filter(Boolean).sort().join('_');
      if (!familyGroups.has(parentKey)) {
        familyGroups.set(parentKey, []);
      }
      familyGroups.get(parentKey)!.push(m);
    }
  });

  familyGroups.forEach((children, parentKey) => {
    const parentIds = parentKey.split('_');
    const parents = positionedMembers.filter((p) => parentIds.includes(p.id));

    if (parents.length === 0) return;

    let stemX = 0;
    let stemY = 0;

    if (parents.length === 2 && parents[0].x !== undefined && parents[1].x !== undefined) {
      // Parent couple: stem starts at the EXACT MIDPOINT of the marriage line!
      const leftParent = parents[0].x < parents[1].x ? parents[0] : parents[1];
      const rightParent = parents[0].x < parents[1].x ? parents[1] : parents[0];

      const spouseStartX = (leftParent.x || 0) + NODE_WIDTH;
      const spouseEndX = rightParent.x || 0;
      stemX = (spouseStartX + spouseEndX) / 2;
      stemY = (leftParent.y || 0) + 60; // Marriage line height
    } else {
      // Single parent: stem starts at bottom center of parent card
      const p = parents[0];
      stemX = (p.x || 0) + NODE_WIDTH / 2;
      stemY = (p.y || 0) + NODE_HEIGHT;
    }

    const firstChildY = children[0].y || 0;
    const midY = stemY + (firstChildY - stemY) / 2;

    children.forEach((child) => {
      const childCenterX = (child.x || 0) + NODE_WIDTH / 2;
      const childTopY = child.y || 0;

      // Path from parent marriage midpoint -> vertical drop to midY -> horizontal to child -> vertical drop to child top
      const path = `M ${stemX} ${stemY} L ${stemX} ${midY} L ${childCenterX} ${midY} L ${childCenterX} ${childTopY}`;

      connections.push({
        id: `parent_child_${parents[0].id}_${child.id}`,
        fromId: parents[0].id,
        toId: child.id,
        type: 'parent-child',
        path,
      });
    });
  });

  return { positionedMembers, connections };
}
