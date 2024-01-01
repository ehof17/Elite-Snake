# 🐍 Elite Snake

## 🚀 Introduction
Elite Snake is not just your ordinary snake game. Built with React, Express, Node.js, Socket.io, and Vite, it's a vibrant, interactive experience with customizations, special food effects, and a competitive leaderboard. Join the fun at [Elite Snake](http://23.239.5.150:3000/).

## ⚠️ Disclaimer
This project is inspired by and based upon Clément Mihailescu's Snake Game, as featured in his [YouTube tutorial](https://www.youtube.com/watch?v=7Rkib_fvowE) and available on [GitHub](https://github.com/clementmihailescu/Snake-Game-Reverse-LL-Tutorial). While the foundational concepts and initial codebase are derived from his work, this multiplayer edition introduces significant enhancements and features, including:

- **Multiplayer Capability** 
- **Customization:** Allowing players to personalize their gaming experience with custom names and colors
- **Modularity:** Split items into components, and added components like the title screen and leaderboard.
- **Mobile Compatibility:** Ensuring a seamless experience across various devices.
- **New Game Mechanics:** Introduction of unique elements like portal foods, adding a new layer of strategy.

This project is meant as a tribute to the original work and an exploration of its potential. It does not replicate the original game in its entirety but rather builds upon it to create a new, unique gaming experience.


## 🌟 Key Features
- **Customizable Gameplay**: Choose your own snake names and colors.
- **Leaderboard**: Compete to be at the top and track top players.
- **Special Food Items**: 
  - **Reversal Food**: Adds a challenging twist by reversing your snake upon consumption.
  - **Portal Food**: Teleport from one point to another for strategic gameplay.
- **Real-Time Multiplayer Competition**: Play against others in real-time with seamless interactions.

## 💻 Technologies Used
- **React**: For a dynamic user interface.
- **Express and Node.js**: Powering the server-side for robust performance.
- **Socket.io**: Enabling real-time communication between players.
- **Vite**: Streamlining the development process.

## 🎮 Play Now
Play online [here](http://23.239.5.150:3000/). Customize your snake, dodge, and teleport to become the leader!

> **Note:** If I ever stop paying to run the server, a legacy single-player experience can be found [here](https://theehofman.github.io/snake2/). This version only has the core gameplay. There are no names, leaderboard, or changing color. Also, it doesn't work on mobile.

## 🛠 Want to Make Changes?
To set up the game locally:
1. Clone the repository.
2. In the root directory, install dependencies: `npm run install:all`  
    ![Alt Text](./gifs/npm%20install%20gif.gif)
3. Navigate to the snake directory: `cd snake`
4. Start the development server: `npm run dev`
5. Vite will output the IP used for multiplayer. Copy it.  
    ![Alt Text](./gifs/cd%20and%20run%20dev%20gif.gif)
6. In your code editor, navigate to snakeserver and find the .env file.
7. Change the `SERVER_IP` to the IP you copied  
    ![Alt Text](./gifs/change%20file%20gif.gif)
8. Stop the server and navigate back to the root directory  
    ![Alt Text](./gifs/backtracking%20gif.gif)
9. Start the server and client: `npm start`  
    ![Alt Text](./gifs/starting%20server%20gif.gif)   
10. Click the link under "Network" to play.
11. As long as you are on the same wifi connection, the game is multiplayer!

## 💬 Contributions and Feedback
Your contributions and feedback are welcome! They help us to continuously improve the game.

## 🙏 Acknowledgements
Special thanks to Clément Mihailescu for the inspiration and foundational work on the original [Snake Game](https://github.com/clementmihailescu/Snake-Game-Reverse-LL-Tutorial).

