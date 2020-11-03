To run this you need to have Node.js and npm
1. Install nodejs (sudo apt install nodejs) OR go to https://nodejs.org/en/ and follow the instructions there to
    download node js and this will also come with the necessary npm manager.
2. Install npm (sudo apt install npm)
3. Inside the project directory run “npm install”.
4. After dependencies are installed, ensure you are in the directory from above and start the server with “node server.js”
5. Use ipconfig or ifconfig to get the local IP address of the computer.
    Open your browser and navigate to https://<localip>:8090 where <localip> is the ip found in the step above.
    OR if accessing on the same machine you can use https://127.0.0.1:8090 however if running mitmproxy you will not
    be able to detect internal traffic.