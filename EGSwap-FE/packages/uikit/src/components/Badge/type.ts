export interface BadgeProps {
    title?: string;
    variants?: string;
}

export type Variants = (typeof variants)[keyof typeof variants];

export const variants = {
    TYPE1: 'type1',
    TYPE2: 'type2',
} as const;