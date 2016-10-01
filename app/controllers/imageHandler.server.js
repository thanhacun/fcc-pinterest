import Users from '../models/users.js';

function ImageHandler(){
    this.addOrGetImage = (req, res) => {
        if (req.query.imgLink) {
            //User upload an image url
            const newImage = {imgUrl: req.query.imgLink, imgDes: req.query.imgDes};
            Users.findOneAndUpdate({'twitter.id': req.user.twitter.id},
                { $push : {'imgLinks': newImage}})
            .exec((error, result) => {
                if (error) {throw error;}
                res.json(result);
            });
        } else {
            Users.findOne({'twitter.id': req.user.twitter.id}, (error, result) => {
                console.log(result);
                if (error) { throw error; }
                res.json(result.imgLinks);
            });
            
        }
        
        
    };
}

module.exports = ImageHandler;