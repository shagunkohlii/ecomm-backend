const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000;
const mongoConnect = require('./db')
const app = express()
const userRoute = require('./routes/userRoute.jsx')
const productRoute = require('./routes/productRoute.js')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie, fetchUser } = require('./middlewares/authentication.js')
const cartRoute = require('./routes/cart.js')
// mongodb
mongoConnect()

// middlewares
app.use(cors({ origin: ['http://localhost:3000', 'https://shagunkohlii-cartify.vercel.app'], methods: ["GET", "POST"] }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/api/cart', fetchUser, cartRoute)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.get('/', (req, res) => {
    const data = { message: "welcome to homepage " }
    res.json(data);
})


// server
app.listen(PORT, () => {
    console.log("server started... at port:", PORT)
})
