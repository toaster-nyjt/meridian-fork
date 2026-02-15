export const menuConfig = {
  customDetailViewTypes: [
    // { type: 'thesaurus', view: DetailThesaurus, defaultSpec: {} },
  ],
  customOverviewTypes: [
    // {
    //   type: 'grid',
    //   view: OverviewGrid,
    //   defaultSpec: {
    //     itemView: { type: 'synonym' },
    //   },
    // },
  ],
  customItemViewTypes: [
    // { type: 'synonym', view: ItemSynonym, defaultSpec: {} },
  ],
  onOpenDetailNewPage: (item: any) => {
    // window.location.href = `/d2-3/${item?.id}`;
  },
  onOpenOverviewNewPage: () => {
    // window.location.href = `/d1-2`;
  },
};
