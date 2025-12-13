# UConn CSE 4701 Database Project

ER Diagram Available in the `docs/` directory.

Upon `git clone https://github.com/pthomasv/4701.git`, install the npm packages in the `server/` directory.
```bash
cd server ; npm install
```
From the root directory, you may initialize the DB and the backend NodeJS server as follows:
```bash
cd server/db ; node init.js
```
```bash
cd server/ ; node server.js
```

To access the frontend, you will need the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VSCode extension.
Upon installing the extension, you will be able to "Go Live" on the bottom right corner of VSCode.
Navigate to `client/landing.html` and click "Go Live"

To see changes within `server/db/app_database.db`, you can install [SQLite](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite) and [SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer). 
It will not automatically refresh the database when it is updated, that has to be done manually via the refresh button on the top right.

Have fun!