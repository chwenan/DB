const router = require("express").Router();
const axios = require("axios"); // 用於獲取外部API資料
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../model/user");

// 1. 從 Fake API 進口用戶資料並存入 MongoDB
router.post("/import", async (req, res) => {
    try {
        // 從 Beeceptor API 獲取假資料
        const response = await axios.get("https://fake-json-api.mock.beeceptor.com/users");
        const users = response.data; // 獲取 API 回傳的用戶資料
        
        // 將每個用戶資料儲存到 MongoDB
        users.forEach(async (user) => {
            const newUser = new User({
                name: user.name,
                company: user.company,
                username: user.username,
                email: user.email,
                address: user.address,
                zip: user.zip,
                state: user.state,
                country: user.country,
                phone: user.phone,
                photo: user.photo,
            });
            await newUser.save(); // 儲存至 MongoDB
        });
        
        res.status(200).send("Users imported successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error importing users");
    }
});

// 2. 顯示所有用戶資料
router.get("/", async (req, res) => {
    try {
        const users = await User.find(); // 從 MongoDB 查詢所有用戶
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching users");
    }
});

// 3. 新增用戶資料
router.post("/", upload.single("image"), async (req, res) => {
    try {
        let avatarUrl = null;
        
        // 若有上傳圖片，將圖片上傳至 Cloudinary
        if (req.file) {
            const result = await cloudinary.upload.upload(req.file.path);
            avatarUrl = result.secure_url;
        }

        const newUser = new User({
            name: req.body.name,
            company: req.body.company,
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            zip: req.body.zip,
            state: req.body.state,
            country: req.body.country,
            phone: req.body.phone,
            photo: avatarUrl,
        });

        await newUser.save(); // 儲存到 MongoDB
        res.status(201).json(newUser); // 返回新增的用戶資料
    } catch (err) {
        console.log(err);
        res.status(400).send("Error adding user");
    }
});

// 4. 刪除用戶資料
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId); // 查詢特定用戶

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 若用戶有圖片，刪除 Cloudinary 上的圖片
        if (user.photo) {
            await cloudinary.uploader.destroy(user.cloudinary_id); // 刪除 Cloudinary 上的圖片
        }

        // 刪除用戶資料
        await user.deleteOne();
        res.json({ success: true, message: "User deleted" });
    } catch (err) {
        console.log(err);
        res.status(400).send("Error deleting user");
    }
});

// 5. 更新特定用戶資料
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId); // 查詢用戶

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 如果上傳了新的圖片，先刪除舊的圖片，再上傳新的圖片
        if (req.file) {
            if (user.photo) {
                await cloudinary.uploader.destroy(user.cloudinary_id); // 刪除舊圖片
            }
            const result = await cloudinary.uploader.upload(req.file.path); // 上傳新圖片
            req.body.photo = result.secure_url; // 更新圖片 URL
            req.body.cloudinary_id = result.public_id; // 更新 Cloudinary ID
        }

        // 更新用戶資料
        user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(400).send("Error updating user");
    }
});

// 6. 查詢單一用戶資料
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId); // 查詢特定用戶

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json(user); // 返回單一用戶資料
    } catch (err) {
        console.log(err);
        res.status(400).send("Error fetching user");
    }
});

module.exports = router;
