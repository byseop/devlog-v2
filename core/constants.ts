export const DEFINED_FILTER = {
  STATUS_PUBLISHED: {
    type: 'status',
    status: {
      equals: 'Done'
    },
    property: 'yt%5C%3E'
  },
  MULTI_SELECT_CATEGORY: (name: string) => ({
    multi_select: {
      contains: name
    },
    property: 'lRz%3A'
  }),
  TITLE_CONTAINED: (query: string) =>
    ({
      title: {
        contains: query
      },
      property: 'title',
      type: 'title'
    } as const),
  RICH_TEXT_CONTAINED: (query: string) =>
    ({
      rich_text: {
        contains: query
      },
      property: '%7DEAT',
      type: 'rich_text'
    } as const)
} as const;
