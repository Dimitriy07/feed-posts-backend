const { buildSchema } = require("graphql");

// for mutation we can use different syntaxis, we can use input in parenthesis and separate data of input in special type with special keyword - "input" (data which is used as an argument)
module.exports = buildSchema(` 
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User{
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData{
        token: String!
        userId: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    
    input UserInputData{
        email: String!
        name: String!
        password: String!
    }

    input PostInputData{
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery{
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
        post(id: ID!): Post!
        user: User!
    }

    type RootMutation{
        createUser(userInput: UserInputData) : User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData):Post!
        deletePost(id: ID!): Boolean
        updateStatus(status: String!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `);
