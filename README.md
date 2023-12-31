# 🐍 Elite Snake

## Introduction 🚀
Built with React, Express, Node.js, Socket.io, and Vite, this isn't just your ordinary snake game. It's a vibrant, interactive experience with customizations, special food effects, and a competitive leaderboard. Get in on the fun at [Multiplayer Snake Game](http://23.239.5.150:3000/).

## Key Features 🌟
- **Customizable Gameplay**: Players can choose their own snake names and colors.
- **Leaderboard**: Track top players and compete to be at the top.
- **Special Food Items**: 
  - **Reversal Food**: Consuming these special items reverses your snake, adding a challenging twist.
  - **Portal Food**: Teleport from one point to another for strategic gameplay.
- **Real-Time Multiplayer Competition**: Play against others in real-time with seamless interactions.

## Technologies Used 💻
- **React**: For a dynamic user interface.
- **Express and Node.js**: Powers the server-side for robust performance.
- **Socket.io**: Enables real-time communication between players.
- **Vite**: Streamlines the development process.

## Play Online Now 🎮
Join the action [here](http://23.239.5.150:3000/). Customize your snake, dodge, and teleport to become the leader!

## Play Offline Now
If I ever stop paying to run the server a legacy single player experience can be found [here](https://theehofman.github.io/snake2/)

## Getting Started 🛠
To set up the game locally:
1. Clone the repository.
2. In the root directory:
3. Install dependencies: `npm run install:all`
    ![Alt Text](./gifs/npm%20install%20gif.gif)
4. Navigate to the snake directory `cd snake`
5. Start the development server `npm run dev`
    ![Alt Text](./gifs/cd%20and%20run%20dev%20gif.gif)
6. Vite will output the IP used for multiplayer. Copy it.
7. In your code editor, navigate to snakeserver and find the .env file.
8. Change the `SERVER_IP` to the IP you copied
    ![Alt Text](./gifs/change%20file%20gif.gif)
9. Stop the server and navigate back to the root directory
    ![Alt Text](./gifs/backtracking%20gif.gif)
10. Start the server and client: `npm start`
    ![Alt Text](./gifs/starting%20server%20gif.gif)   
11. Click the link under "Network" to play.
12. As long as you are on the same wifi connection, the game is multiplayer!

## Contributions and Feedback 💬
Your contributions and feedback are welcome! They help us to continuously improve the game.

## Acknowledgements 🙏
A big shout-out to the players and supporters who have made this game a fun and interactive experience.
