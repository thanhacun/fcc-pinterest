import Users from '../models/users.js';

function ImageHandler(){
    this.addOrGetOrDeleteImage = (req, res) => {
        //DO NOT Forget break
        switch (req.query.action) {
            case 'upload':
                //user upload an image url
                //TODO: only when login
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
                //TODO: only when login
                Users.findOneAndUpdate({'twitter.username': req.query.username}, 
                    {$pull: {imgLinks: {_id: req.query.imgId}}},
                    (error, result) => {
                        if (error) {throw error;}
                        res.json(result.imgLinks);
                    });
                    break;
            default:
                //update images list
                Users.find({}, (err, results) => {
                    if (err) { throw err; }
                    //let initialState = {};
                    const images = results.reduce((pre, cur) => {
                      return (pre.concat(
                          //NOTE:need to use toObject to convert mongoose objects into plain objects 
                          cur.imgLinks.map(imgLink => Object.assign({}, {user:cur.twitter.username}, imgLink.toObject()))
                        ));
                    }, [])
                    .sort((e1, e2) => (e1.uploaded > e2.uploaded));
                    res.json(images);
                });
        }
        
    };
}

module.exports = ImageHandler;