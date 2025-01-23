# DISCORD BOT
#### By [@Corentin-k](https://github.com/Corentin-k) and [@kevin-71](https://github.com/kevin-71).
----
:fr: [Version Française](/README-fr.md)

Inspired by [the Crobotic Association's bot ](https://github.com/Crobot-ic/WebSite/tree/main/Server
) whith the assistance of [@Serquand](https://github.com/Serquand)
  

- [x] Create a  /planning command to retrieve schedule of somebody.
- [X] Create a command that provides informations about a book. This command uses the Google API.
- [X] Create a command that provides informations about a movie This command uses the OMBd API.
- [ ]  Created a command that retrieves data of the book/movie command and saves it in a database.
- [ ] Adding librairies control system
----
###    1. <u> Installation</u>

  Create a Git repository in a directory or download  the [zip](https://github.com/Corentin-k/Bot/archive/refs/heads/main.zip) file

        git init
        git clone https://github.com/Corentin-k/Bot.git

  From a terminal (use the VS Code terminal):

        npm install
        npm install discord.js axios node-ical moment moment-timezone uuid
        npm i -D @types/uuid

  Install node.js by follow the steps at https://nodejs.org/fr
  or with chocolatey using `choco install nodejs`


### 2. <u>Create the .env file</u> 
  Create .env file and follow information in the file "[.env.example](https://github.com/Corentin-k/Bot/blob/main/.env.example)".
  
  * To create a discord bot --> https://discord.com/developers/
  and obtain a Token bot.
  > :warning: NEVER share the token on the internet or push it to Github.
  
  * To get the ID of the discord server : 

      Server Settings> widget>SERVER ID
    
  * To retrieves the ID of the discord channel :

      Right-click on the channel > Copy Channel ID
      

> :bulb: An API key is required to access the /livre and /film commands.

  * Obtain the Google API key from https://developers.google.com/books?hl=fr for the[/livre](/src/commands/livre.ts) command.
  * Obtain the OMDb API key from https://www.omdbapi.com/ for the [/film](/src/commands/film.ts) command.

### 3. <u>To Start the Bot</u> 

Enter the following command:

    npx nodemon

and wait to have this message : "Bot launched !"

![Alt text](/src/images/message.png)

> :warning: If the bot doesn't work type the following command in the terminal: `npm install -g npm`. 

### Example Output 

* [Command /Planning](/src/commands/planning.ts)

    ![Alt text](/src/images/image.png)
    ![Alt text](/src/images/image2.png)

* [Command /Livre](/src/commands/livre.ts)

    ![Alt text](/src/images/image-livre.png)
* [Command /Film](/src/commands/film.ts)

    ![Alt text](/src/images/image-film.png)