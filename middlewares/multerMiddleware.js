const multer= require('multer');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/temp');
    },
    filename:function(req,file,cb){
        const uniqueSuffix=Date.now() +'_'+Math.round(Math.random() * 1E9)
        cb(null,file.originalname+ '_' + uniqueSuffix)
    }
})
const upload=multer({storage: storage})
module.exports={upload}