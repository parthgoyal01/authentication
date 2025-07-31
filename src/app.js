const express = require('express');
const authRoutes = require("./routes/auth.routes")
const cookieParser = require('cookie-parser');


const app=express();
app.use(express.json())
app.use(cookieParser())


app.use('/auth',authRoutes)

// app.use('/product',productRoutes)   // in similar way if we have to create api related to products then its name should be /product.



module.exports = app;