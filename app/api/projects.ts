export const sorts = ["updated", "created"] as const;
export type Sort = (typeof sorts)[number];
