import {Category, Topic} from "@utils/types/forum";

export const TopicLinkFactory = (topic: Topic): string => {
    return `/topics/${topic.id}`;
}

export const CategoryLinkFactory = (category: Category): string => {
    return `/categories/${category.id}`;
}

export const LoginLinkFactory = (): string => {
    return `/auth/login`;
}