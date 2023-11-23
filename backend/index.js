const express = require('express');
const mongoDB = require('./Mongo');
const User = require('./Models/User');
const app = express();
var bodyParser = require('body-parser')
const cors = require('cors')


// Process data sent in an HTTP request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
app.use(cors())


// MongoDB Connection
mongoDB();


// Get Request to Fetch Users 
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            res.status(404).json("Users Not Found")
        } else {
            res.status(200).json(users)
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


// Get Request to Fetch a Single User based on their _id 
app.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: id });
        if (!user) {
            res.status(404).json("Users Not Found")
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


// Post request to Add/Create Users
app.post('/user', async (req, res) => {
    try {
        const { name, age, phone } = await req.body;

        const userExists = await User.findOne({ name: name, phone: phone });


        if (userExists) {
            res.status(404).json({ message: "User already Exists" })
        } else {
            const NewUser = new User({
                name: name,
                age: age,
                phone: phone
            })

            const savedUser = await NewUser.save()
            res.status(200).json({ message: "User successfully created", savedUser })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})


// Put Request to Edit/Update Users
app.put('/user/:id', async (req, res) => {
    try {
        const fields = await req.body;
        const { id } = req.params
        const userExists = await User.findOne({ _id: id })

        if (userExists) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: userExists._id },
                { $set: fields },
                { returnOriginal: false }
            )
            res.status(200).json({ updatedUser })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


// Delete Request to Delete User Based on their _id
app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userExists = await User.findOne({ _id: id })
        if (userExists) {
            const deletedUser = await User.findOneAndDelete({ _id: id })
            res.status(200).json(`User ${deletedUser.name} Successfully deleted!`)
        } else {
            res.status(404).json("User does not exist")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})


// Server Listening on port 
app.listen(port, () =>
    console.log(`Express server is running on port ${port}`)
)