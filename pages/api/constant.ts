export const DEFINED_FILTER = {
  STATUS_PUBLISHED: {
    type: 'status',
    status: {
      equals: 'Done'
    },
    property: 'yt%5C%3E'
  }
} as const;
