import express, { type Request, type Response } from 'express';
import dotenv from "dotenv";
import shoeShopServer from './shoeshopapi/index.ts';
import job from "./lib/cron.ts"
import multer from 'multer';

dotenv.config();
const upload = multer();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const handleHealth = (req: Request, res: Response) => {
  res.status(200).json({success:true})
}

job.start()
app.get("/health",handleHealth)


// Root route
app.use("/shoeshop", shoeShopServer);
app.get("/", (req: Request, res: Response) => {
  res.json({Description:"Welcome to the Multi-API Express Server with Bun!",
    "Shoe sho api":{
      "PUBLIC END POINT":[{
        "Register":{
          route:"http://localhost:3000/shoeshop/auth/login",
          method:"POST",
          body:        {
            "name": "Son Smith",
            "email": "son.smith@example.com",
            "avator": "https://example.com/avatars/jane.jpg",
            "password":"customer123",
            "role": "CUSTOMER"
          }
        },
        "Login":{
          route:"http://localhost:3000/shoeshop/auth/login",
          method:"POST",
          body:{
              "email": "john.doe@example.com",
              "password":"admin123"
            }
        },
      }],
      "PRIVATE END POINT":[{
        "Get Profile":{
          route:"https://exp-server-collection.onrender.com/shoeshop/auth/me",
          method:"GET"
        },
        "Get paged shoes":{
          route:"",
          method:"GET",
        },
        "Add shoes":{
          route:"",
          method:"POST",
          body:{

          }
        },
        "Get shoes datail":{
          route:"",
          method:"GET"
        },
        "Update shoes":{
          route:"",
          method:"PUT",
          body:{

          }
        },
        "Delete shoes":{
          route:"",
          method:"DELETE"
        },


      }]
    }
  })

});

app.use((req: Request, res: Response) => {
  res.status(404).json({message:"Resource not found."})
})
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
// Start server
setInterval(async function(){
 const response = await fetch(process.env.SERVERURL!);
 if(response.ok){
  console.log("Running ... on"+process.env.SERVERURL)
 }
},14*60*1000);
app.listen(port,() => {
  console.log(`Server running on http://localhost:${port}`);
});
