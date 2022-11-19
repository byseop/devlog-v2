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
  })
} as const;
