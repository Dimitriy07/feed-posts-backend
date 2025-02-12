# 🏨 Feed Posts Management System

This is a study project - backend application built with Node.js, GraphQL, and MongoDB to handle the creation, management, and display of feed posts. 

## 🚀 Features

* **User Authentication:** Secure login and signup functionality.
* **Article Management:**
    * Create, read, update, and delete posts.
* **GraphQL API:** Efficient data fetching and manipulation with GraphQL.
* **MongoDB:** Scalable and flexible database for storing posts and user data.
* **Error Handling:** Graceful error handling and user feedback.

## 🛠️ Technologies Used

* **Node.js:** A JavaScript runtime for building the backend.
* **Express:** A web framework for Node.js.
* **GraphQL:** A query language for APIs.
* **MongoDB:** A NoSQL database for storing data.
* **Mongoose:** An ODM (Object Data Modeling) library for MongoDB.
* **Multer:** Middleware for handling file uploads.
* **JWT:** JSON Web Tokens for user authentication.
* **Bcrypt:** For password hashing.
* **Validator:** For input validation.


## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/feed-posts-management.git)](https://github.com/Dimitriy07/feed-posts-backend.git
```

2. **Navigate to the project directory:**

   ```bash
   cd feed-articles-management
```

3. **Install dependencies:**

   ```bash
   npm install
```

4. **Set up environment variables:**
    * Create a `.env` file in the root directory.
    * Add the required environment variables (e.g., MongoDB connection string, JWT secret).

5. **Run the backend server:**
   ```bash
   npm run server
```

## 🧠 Advanced Features

* **GraphQL API**
    * Efficiently fetch and manipulate data using GraphQL queries and mutations.
        ```graphql
        query {
          posts(page: 1) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
            }
            totalPosts
          }
        }
        ```

* **Real-time Updates**
    * Uses WebSockets to provide real-time updates for post changes.
        ```javascript
        io.getIO().emit("posts", { action: "create", post: newPost });
        ```

* **Image Upload**
    * Uses Multer middleware to handle image uploads.
        ```javascript
        const upload = multer({ storage: fileStorage, fileFilter: fileFilter }).single("image");
        ```

* **Authentication**
    * Uses JWT for secure user authentication.
        ```javascript
        const token = jwt.sign({ userId: user._id.toString() }, "somesupersecretsecret", { expiresIn: "1h" });
        ```


## 🙏 Acknowledgments

* **GraphQL:** For providing an efficient and flexible API.
* **MongoDB:** For offering a scalable and flexible database solution.
