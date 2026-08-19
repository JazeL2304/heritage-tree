import { FamilyMember, TreeConnection } from '@/types/family';

export const INITIAL_MEMBERS: FamilyMember[] = [];

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

  // Compute generation depth dynamically for each member
  const depthMap = new Map<string, number>();

  function getDepth(m: FamilyMember, visited = new Set<string>()): number {
    if (visited.has(m.id)) return depthMap.get(m.id) || 1;
    visited.add(m.id);

    // If member has parents, level MUST be parent level + 1
    if (m.fatherId || m.motherId) {
      let maxParentDepth = 0;
      if (m.fatherId) {
        const father = members.find((p) => p.id === m.fatherId);
        if (father) maxParentDepth = Math.max(maxParentDepth, getDepth(father, new Set(visited)));
      }
      if (m.motherId) {
        const mother = members.find((p) => p.id === m.motherId);
        if (mother) maxParentDepth = Math.max(maxParentDepth, getDepth(mother, new Set(visited)));
      }
      if (maxParentDepth > 0) return maxParentDepth + 1;
    }

    // If member has a spouse who has parents, match spouse level
    if (m.spouseId) {
      const spouse = members.find((s) => s.id === m.spouseId);
      if (spouse && (spouse.fatherId || spouse.motherId)) {
        return getDepth(spouse, new Set(visited));
      }
    }

    return m.generation || 1;
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
