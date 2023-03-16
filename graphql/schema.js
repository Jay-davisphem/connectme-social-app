const { buildSchema } = require("graphql");

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

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    isActive: Boolean!
    role: String!
    posts: [Post!]!
  }

  type AuthData{
    token: String!
    userId: String!
  }

  input UserInputData {
    email: String!
    name: String
    password: String
    role: String
  }
  
  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type postData {
    posts: [Post!]!
    totalPosts: Int
    next: Int
    previous: Int
  }
  type RootQuery{
    login(userInput: UserInputData!): AuthData!
    getPosts(page: Int, limit: Int): postData!
    getPost(postId: ID!): Post!
    getUsers: [User!]!
  }
  
  type RootMutation {
    createUser(userInput: UserInputData!): User!
    createPost(postInput: PostInputData!): Post!
    updatePost(postId: ID!, postInput: PostInputData): Post!
    deletePost(postId: ID!): Boolean!
    updateUser(userInput: UserInputData!): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
