export type Post = {
    author: string,
    content: string, 
    date: string,
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
    atheletic: Array<Activity>
    club: Array<Activity>
}