const express = require('express');
const cors = require('cors');
const appRouter = require('./routes/index')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1',appRouter);


app.listen(3000,()=>{
    console.log("Connected to PORT 3000")
});

