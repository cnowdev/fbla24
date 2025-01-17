export type Post = {
    id?: string,
    authorId: string,
    authorPfp?: string,
    content: string, 
    createdAt: Date,
    likes: string[],
    replyingTo?: string,
}


export type User = {
    id?: string,
    email: string,
    followers: string[],
    name: string,
    password: string,
    posts: Post[],
    username: string,
    about: string,
    hours: number,
}

export type Activity = {
    title: string,
    description: string,
    startedAt: number | string, 
    endedAt: number | string| null, 
}

export type ProfileType = {
    id?: string,
    creator_id: string,
    classes: Array<string>,
    achievements: Array<string>,
    academic: Array<Activity>,
    athletic: Array<Activity>
    performing: Array<Activity>
    club: Array<Activity>
}