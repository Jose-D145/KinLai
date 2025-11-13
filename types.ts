
export interface School {
  id: number;
  name: string;
  logoUrl: string;
}

export interface Association {
  name: string;
  logoUrl: string;
}

export type GridItemType = School | { type: 'association' } | { type: 'empty' };
