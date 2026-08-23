export type FilterItems<T> = (items: T[], keywords: string) => T[];
export declare const createFilterItems: <T>(props: (keyof T)[]) => FilterItems<T>;
