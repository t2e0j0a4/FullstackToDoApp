# FullstackToDoApp - ToDos...

Hey All! Just done with a TODO Application and works very cool. It takes user details and shows or saves todo work of that user in database. And displays you when you login.

Let's see the Tech Stack & How you can run this on your local machine. As I didn't host this application.

Tech Stack :-
- Client Side : HTML for Structure, CSS & Bootstrap for Styles, Javascript for API Integrations.
- Server Side : Node.js & Express.js for Web Server, MongoDB Atlas for Databse, JWT for user authentication, Mongoose for easy connection & assessbility of MongoDB to my application. As It is top of MongoDB.

Run in your local machine :-
- Download ZIP or Clone of this Repository : [Repo](https://github.com/t2e0j0a4/FullstackToDoApp/)
- After you install, In your _servers/_ folder create a __.env__ file and write this in that file.

  ```
   MONGO_URI = Your MongoDB Atlas Connection String.
   JWT_SECRET = Any Secret String for JWT Secret.
  ```
- You can get your MongoDB Atlas URI Connection String by going to MongoDB Atlas Website and create an account if you don't have one and create a free cluster and get the connection string, paste above as directed and replcae username, password, cluster name of string. And JWT Secret and String of characters.
- Then, In your terminal, Open in _servers/_ folder and execute these commands.
  - `npm install`
  - `nodemon ./index.js` or `node ./index.js` or `npm start` All are same.
- Your Server will start working.
- Then move to _clients/_ folder, Open index.html file and start running it via _Live Server_ or normally.
- That's all your app will start running.

Have any queries can contact me via :-
- [@Twitter](https://twitter.com/innerteja04/)
- [@LinkedIn](https://linkedin/com/in/t2e0j0a4/)
- Checkout my Github : [@Github](https://github.com/t2e0j0a4/)

Yes, you can contribute to this repo :-
- See & Check the Code.
- Have any errors or changes do them.
- And finally make a pull request to me.
