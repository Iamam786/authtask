require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();

// other packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// database
const dbConnect = require('./db/dbConnect');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

// routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await dbConnect(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server running at ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

startServer();
