export interface UsageSpec {
  id: string;

  rolesUsage: {
    [role: string]: number;
  },
  overviewUsage: {
    type: {
      [type: string]: number;
    },
    itemView: {
      [itemView: string]: number;
    },
    numberOfViews: number;
  },
  detailViewUsage: {
    type: {
      [type: string]: number;
    },
    openIn: {
      [openIn: string]: number;
    },
    openFrom: {
      [openFrom: string]: number;
    },
    openBy: {
      [openBy: string]: number;
    },
    numberOfViews: number;
  }
}
