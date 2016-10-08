import Users from '../models/users.js';

function ImageHandler(){
    this.addOrGetOrDeleteImage = (req, res, cb) => {
        //DO NOT Forget break
        //using (null, null, cb) to request without using req, res
        const action = (!req) ? 'nothing' : req.query.action;
        switch (action) {
            case 'upload':
                //user upload an image url
                //if (!req.isAuthenticated()) { res.redirect('/login'); }
                const newImage = {imgUrl: req.query.imgLink, imgDes: req.query.imgDes};
                Users.findOneAndUpdate({'twitter.id': req.user.twitter.id},
                    { $push : {'imgLinks': newImage}})
                .exec((error, result) => {
                    if (error) {throw error;}
                    res.json(result.imgLinks);
                });
                break;
            case 'delete':
                //user delete an image
                //if (!req.isAuthenticated()) { res.redirect('/login'); }
                Users.findOneAndUpdate({'twitter.username': req.query.username}, 
                    {$pull: {imgLinks: {_id: req.query.imgId}}},
                    (error, result) => {
                        if (error) {throw error;}
                        res.json(result.imgLinks);
                    });
                break;
            case 'test':
                Users.findOne({'twitter.username': 'thanhacun'})
                    .populate('imgLinks')
                    .exec((err, images) => {
                        if(err) {throw err;}
                        res.json(images);
                    });
                break;
            default:
                //update images list
                Users.find({}).sort('-uploaded').exec((err, results) => {
                   if (err) { throw err; }
                   const images = results.reduce((pre, cur) => {
                      return (pre.concat(
                         cur.imgLinks.map(imgLink => Object.assign({}, {user: cur.twitter.username}, imgLink.toObject()))
                       )); 
                   }, []);
                   if (!req) {
                       cb(images);
                   } else {
                       res.json(images);
                   }
                });
        }
        
    };
    this.likeToggle = function(req, res) {
        //Using post method
        const image = JSON.parse(req.query.image);
        Users.update({'twitter.username': image.user, 'imgLinks._id': image._id},
        {$set :{'imgLinks.$.like': image.like}},
        (error, result) => {
           if (error) {throw error;}
           res.json(result);
        });
    };
}

module.exports = ImageHandler;