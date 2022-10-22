# hw-backend

This is the backend part of my implementation of the Jack's Warehouse system. The following technologies were employed:  

* Node (https://nodejs.org/en/)
* Typescript (https://www.typescriptlang.org/)
* Prisma (https://www.prisma.io/)

How to run:

* Make sure that port http/4000 is available. 
* Create a `.env` file at the root folder of the project. Set the `API_KEY_GOOGLE` variable in the `.env` file, required to use maps API. E.g. `API_KEY_GOOGLE=AIfakeD0keydffakeYckeyTfakeOArkeyvVv9Ps`

After setting up the `.env` file, run the following commands from the root folder:
* `npm install`
* `npm run dev`

The application server should start promptly. 
NOTE: The SQLite database file (binary) is versioned along with the code for simplicity. There is no need to setup a database connection.
