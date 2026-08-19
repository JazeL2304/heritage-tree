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
 * Calculates (x,y) layout coordinates for all members in the tree and exact connector paths
 */
export function calculateTreePositions(members: FamilyMember[]): {
  positionedMembers: FamilyMember[];
  connections: TreeConnection[];
} {
  const NODE_WIDTH = 160;
  const NODE_HEIGHT = 160;
  const LEVEL_SPACING = 140;
  const SIBLING_SPACING = 50;

  // Group members by generation or computed depth
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

  // Compute connections (exact center points of node cards)
  positionedMembers.forEach((m) => {
    const childCenterX = (m.x || 0) + NODE_WIDTH / 2;
    const childTopY = m.y || 0;

    // Parent -> Child connections
    if (m.fatherId || m.motherId) {
      const father = positionedMembers.find((p) => p.id === m.fatherId);
      const mother = positionedMembers.find((p) => p.id === m.motherId);
      const primaryParent = father || mother;

      if (primaryParent && primaryParent.x !== undefined && primaryParent.y !== undefined) {
        let parentCenterX = primaryParent.x + NODE_WIDTH / 2;
        if (father && mother && father.x !== undefined && mother.x !== undefined) {
          parentCenterX = (father.x + NODE_WIDTH / 2 + mother.x + NODE_WIDTH / 2) / 2;
        }

        const startY = primaryParent.y + NODE_HEIGHT;
        const endY = childTopY;
        const midY = startY + (endY - startY) / 2;

        const path = `M ${parentCenterX} ${startY} L ${parentCenterX} ${midY} L ${childCenterX} ${midY} L ${childCenterX} ${endY}`;
        connections.push({
          id: `conn_${primaryParent.id}_${m.id}`,
          fromId: primaryParent.id,
          toId: m.id,
          type: 'parent-child',
          path,
        });
      }
    }

    // Spouse connection
    if (m.spouseId) {
      const spouse = positionedMembers.find((s) => s.id === m.spouseId);
      if (spouse && m.id < spouse.id && m.x !== undefined && m.y !== undefined && spouse.x !== undefined && spouse.y !== undefined) {
        const spouseLeftX = m.x + NODE_WIDTH;
        const spouseRightX = spouse.x;
        const spouseY = m.y + NODE_HEIGHT / 2;

        const path = `M ${spouseLeftX} ${spouseY} L ${spouseRightX} ${spouseY}`;
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

  return { positionedMembers, connections };
}
