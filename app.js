const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
//Database
mongoose.connect("mongodb://localhost:27017/todoDB",{useNewUrlParser:true});

const itemsSchema = {
   name:String
};

  const Items = mongoose.model("item",itemsSchema);

 const homeWork = new Items  ({
   name:"Homework"
 });

  const coding = new Items({
    name:"coding"
  });
    
    const eating = new Items({
      name:"eating food"
    });

    
  

  const listSchema = {
    name:String,
    items:[itemsSchema]
  };


  const List = mongoose.model("List",listSchema);


 const defaultItems  = [homeWork,coding,eating];

 












const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res) {

   const day  = date.getDate();


      Items.find({},function(err,foundItems) {
        if (foundItems.length === 0){
         const defaultArray = [homeWork,coding,eating];
  Items.insertMany(defaultArray,function(err) {
  if(err){
    console.log(err);
   }
    else {
      console.log("Successfully add all Items to the Items collection!");
    }
  });
        }
         else {
             res.render("list", {listTitle:day, newListItems: foundItems});

         }

        
   });

   
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Items({

    name:itemName
  });
    newItem.save();

    res.redirect("/");
  });


   app.post("/delete",function(req,res){
    const checkedItemId = (req.body.checkbox);
       Items.findByIdAndRemove({_id:checkedItemId},function(err) {
          if (err){
            console.log(err);
          }
           else {
             console.log("success");
             res.redirect("/");
           }
       })
   })
   

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
