const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {z} = require("zod")
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db/index");
const { authMiddleware } = require('../middleware');

// Ensure JWT key is present
if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY environment variable is not set.");
}

const signupBody = z.object({
    username: z.string().email(),
	password: z.string()
})

router.post('/signup', async (req, res) => {
    const parsed = signupBody.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ errors: parsed.error.errors });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ msg: "Username and password are required." });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send({ msg: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username: username, password: hashedPassword });

        const userId = user._id;

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        res.status(201).send({ msg: "User created successfully.", token: token });
    } catch (error) {
        res.status(500).send({ msg: "User not created successfully.", error: error.message });
    }
});

const signinBody = z.object({
    username: z.string().email(),
	password: z.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({message: "Email already taken / Incorrect inputs"})
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({token: token})
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = z.object({
	password: z.string().optional(),
    /*firstName: z.string().optional(),
    lastName: z.string().optional(),*/
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";

        const users = await User.find({
            username: {
                $regex: filter,
                $options: 'i'  // Case-insensitive
            }
        });

        const responseData = {
            users: users.map(user => ({
                username: user.username,
                _id: user._id
            }))
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error in /bulk route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
