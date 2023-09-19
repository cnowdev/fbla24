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
}