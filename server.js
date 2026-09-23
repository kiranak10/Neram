const express=require("express"), multer=require("multer"), path=require("path"), fs=require("fs"), crypto=require("crypto");
const app=express(),PORT=process.env.PORT||3000;
const ADMIN_EMAIL=process.env.ADMIN_EMAIL||"admin@neram.local",ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||"change-me";
const UP=path.join(__dirname,"uploads"),DB=path.join(__dirname,"songs.json"); if(!fs.existsSync(UP))fs.mkdirSync(UP); if(!fs.existsSync(DB))fs.writeFileSync(DB,"[]");
const upload=multer({dest:UP}); app.use(express.json());app.use(express.static(path.join(__dirname,"public")));app.use("/uploads",express.static(UP));
let tokens=new Set(); const read=()=>JSON.parse(fs.readFileSync(DB));const write=x=>fs.writeFileSync(DB,JSON.stringify(x,null,2));
app.post("/api/login",(req,res)=>{if(req.body.email===ADMIN_EMAIL&&req.body.password===ADMIN_PASSWORD){let t=crypto.randomBytes(24).toString("hex");tokens.add(t);res.json({ok:true,token:t,message:"Logged in"})}else res.status(401).json({ok:false,message:"Invalid login"})});
function auth(req,res,next){let t=req.headers.authorization?.replace("Bearer ","");if(!t||!tokens.has(t))return res.status(401).json({message:"Admin login required"});req.token=t;next()}
app.get("/api/songs",(req,res)=>res.json(read()));
app.post("/api/upload",auth,upload.single("song"),(req,res)=>{if(!req.file)return res.status(400).json({message:"No file"});let songs=read();let id=Date.now();let ext=path.extname(req.file.originalname).toLowerCase();let final=id+ext;fs.renameSync(req.file.path,path.join(UP,final));songs.push({id,title:req.body.title||req.file.originalname,url:"/uploads/"+final});write(songs);res.json({ok:true,message:"Song uploaded"})});
app.delete("/api/songs/:id",auth,(req,res)=>{let songs=read(),s=songs.find(x=>x.id==req.params.id);if(s){let f=path.join(UP,path.basename(s.url));if(fs.existsSync(f))fs.unlinkSync(f);write(songs.filter(x=>x.id!=req.params.id))}res.json({ok:true})});
app.listen(PORT,()=>console.log("Neram running on "+PORT));