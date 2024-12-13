const multer = require("multer");
const path = require("path");

module.exports = multer({
    Storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png"){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);  // 設定檔案名稱，避免重名
        cb(null, fileName);
    },
    destination: function (req, file, cb) {
        cb(null, './uploads');  // 設定儲存檔案的資料夾
    },
});