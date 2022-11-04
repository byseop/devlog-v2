export const DEFINED_FILTER = {
  STATUS_PUBLISHED: {
    type: 'status' as const,
    status: {
      equals: 'In progress'
    },
    property: 'yt%5C%3E'
  }
} as const;
