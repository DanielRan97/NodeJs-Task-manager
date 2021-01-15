const express = require('express');
require('./database/mongoose');
const chalk = require('chalk');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

console.log(process.env.MONGODB_URL);

app.listen(port, () => {
    console.log(chalk.green.bold.inverse("Server is up on " + port));
})