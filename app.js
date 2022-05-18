const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.connect('mongodb://localhost:27017/wikiDB');
const app = express();
app.set('view engine', 'ejs');
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("article", articleSchema);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.route("/articles")
  .get((req, res) => {
    Article.find({}, function(err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        console.log(err);
      }
    })
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    Article.findOne({
      title: req.body.title
    }, function(err, foundArticle) {
      if (!foundArticle) {
        newArticle.save(function(err) {
          if (!err) {
            res.send("Success!");
          } else {
            res.send(err);
          }
        });
      } else {
        res.send("Already exist!");
      }
    })
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      }
    })
  });

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No article matching");
    }
  })
})
.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    // {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully update this article!")
      } else {
        console.log(err);
        res.send("Something goes wrong...")
      }
    }
  )
})
.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully update this part!")
      } else {
        console.log(err);
        res.send("Something goes wrong...")
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
  {title:req.params.articleTitle},
function(err){
  if(!err){
    res.send("Successfully delete this part!")
  } else {
    console.log(err);
    res.send("Something goes wrong...")
  }
})
});


app.listen(3000, () => {
  console.log("listen to port 3000");
});
