export type Gender = 'male' | 'female' | 'other';

export type RelationType = 'parents' | 'sibling' | 'partner' | 'child';

export interface FamilyMember {
  id: string;
  surname: string;
  givenName: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
  isDeceased?: boolean;
  photoUrl?: string;
  notes?: string;
  title?: string;
  generation?: number;
  isVerified?: boolean;
  
  // Relations
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  childrenIds?: string[];
  siblingIds?: string[];

  // Render coordinates computed by tree layout
  x?: number;
  y?: number;
}

export interface TreeConnection {
  id: string;
  fromId: string;
  toId: string;
  type: 'parent-child' | 'spouse' | 'sibling';
  path: string; // SVG path d attribute
}

export interface CanvasTransform {
  x: number;
  y: number;
  zoom: number;
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'json';
  title: string;
  includeNotes: boolean;
}
