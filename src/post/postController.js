const db = require('../../Model/db');
const { param } = require('../user');
const Posts = db.posts;

async function createPost(req, res) {
          try {
            const { posts, description } = req.body;
            if (!posts || !description) {
              return res.status(401).send({
                success: false,
                message: "Invalid Posts",
              });
            }
            const postObj = {
              user_id: req.user.id,
              posts: posts,
              description: description,
            };
            const result = await Posts.create(postObj);
            return res.send(result);
          } catch (e) {
              console.log('errr', e.message)
            res.status(500).json({ message: e.message });
          }
}

async function getPostById(req,res) {
    try{
    const {params}= req;
    const data = await Posts.findOne({where: {user_id: params.id}})
    } catch(e){
        res.status(500).send({message: e.message})
    }
}


 module.exports = { createPost, getPostById };
    