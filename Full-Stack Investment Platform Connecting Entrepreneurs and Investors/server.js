var express=require("express");
var fileupload=require("express-fileupload");
var mysql=require("mysql");
var app=express();


app.listen(2006,function(){
    console.log("Start");
})
app.use(express.static("public"));
// for css and js files
app.get("/",function(req,resp)
  {
    //resp.send("Its Home page<br><h1>Welcome Dear...</h1>");
    var fullPath=__dirname+"/public/index.html";
    resp.sendFile(fullPath);
 })
var configOBJ={
    host:"localhost",
    user:"root",
    password:"",
    database:"users",
}
var dbcontrol=mysql.createConnection(configOBJ);
dbcontrol.connect(function(err){
    if(err){
        console.log(err);

    }
    else{
        console.log("Databaseconnected");
    }
    
})
app.use(express.urlencoded({extended:true}));
app.get("/ajaxemail",function(req,resp){
    var email=req.query.emailid;
    var pass=req.query.pwd;
    var types=req.query.type;
    var arry=[email,pass,types];
dbcontrol.query("insert into train values(?,?,?)",arry, function(err){
    if(err){
        resp.send(err.toString());
    }
    else{
        resp.send("succesfull");
    }

})

});



app.get("/ajaxlogin",function(req,resp)
{
    console.log("connected");
    var em=req.query.emailid;
    var passWord=req.query.pwd;
    
    console.log(req.query);
   
   // var ary=[em,passWord];
    dbcontrol.query("select * from train where email=? and pass=?",[em,passWord],function(err,result)
    {
        if(err)
        console.log(err);
        else{
       
        resp.send(result);
//         if(type=="pitcher"){
// //             app.get("/",function(req,resp)
// //   {
//     //resp.send("Its Home page<br><h1>Welcome Dear...</h1>");
//     var dash=__dirname+"/public/pitcherdash.html";
//     resp.sendFile(dash);
// //  })
//         }
//         else if(type=="investor"){
// //             app.get("/",function(req,resp)
// //   {
//     //resp.send("Its Home page<br><h1>Welcome Dear...</h1>");
//     var idash=__dirname+"/public/investordash.html";
//     resp.sendFile(idash);
// //  })
//         }

       
        }
        
    })
   

})
app.use(fileupload());
app.post("/profilepro",function(req,resp){
    var email=req.body.txtEmail;
    var name=req.body.txtname;
    var cn=req.body.txtcontact;
    var ad=req.body.txtAddress;
    var city=req.body.txtcity;
    var com=req.body.txtcompany;
    var site=req.body.txtsite;
    var picName= req.files.profilepic.name;
    var idproofn=req.files.idproof.name;


        var des=__dirname+"/public/uploads/"+picName;
        //saving file in folder
        req.files.profilepic.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var des=__dirname+"/public/uploads/"+idproofn;
        //saving file in folder
        req.files.idproof.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var arry=[email,name,cn,ad,city,com,site,picName,idproofn];
        dbcontrol.query("insert into pitcher values(?,?,?,?,?,?,?,?,?)",arry, function(err){
            if(err){
                resp.send(err.toString());
            }
            else{
                resp.send("succesfull");
            }
        
        });





})
app.post("/profile-update",function(req,resp)
{
    console.log(req.body);
    //resp.send(req.body);
    var email=req.body.txtEmail;
    var name=req.body.txtname;
    var cn=req.body.txtcontact;
    var ad=req.body.txtAddress;
    var city=req.body.txtcity;
    var com=req.body.txtcompany;
    var site=req.body.txtsite;
    var picName= req.files.profilepic.name;
    var idproofn=req.files.idproof.name;


        var des=__dirname+"/public/uploads/"+picName;
        //saving file in folder
        req.files.profilepic.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var des=__dirname+"/public/uploads/"+idproofn;
        //saving file in folder
        req.files.idproof.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var ary=[email,name,cn,ad,city,com,site,picName,idproofn];
    
        dbcontrol.query("update pitcher set  name=?, contactno=?,address=?,city=?,companyname=?,site=?,idproof=?,profilepic=? where email=?",ary,function(err){
                if(err)
                    resp.send(err);
                    else
                    resp.send("Record Updated Successfulllyyyy");
        })
       

})

 //------------DELETE------------

app.post("/profile-delete",function(req,resp){
    var email=req.body.txtEmail;
    dbcontrol.query("delete from pitcher where email=?",[email],function(err,result)
    {
            if(err)
                resp.send(err);
                else
                if(result.affectedRows==0)
                    resp.send("Invalid Email id");
                    else
                    resp.send("Record Deleted....");
                    
    })
} )
//----------------------
app.get("/AJAXChekEmail",function(req,resp)
{
    var em=req.query.emailidKuch;
    dbcontrol.query("select * from pitcher where email=?",[em],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
            if(result.length==0)
                 resp.send("Available");
                 else
                 resp.send("Already Taken");
               
                    
    })
})
//====================
app.get("/jsonFechRecord",function(req,resp)
{
    var em=req.query.emailidKuch;
    dbCtrl.query("select * from pitcher where email=?",[em],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
                {
                    console.log(result)            ;
                 resp.send(result);//json array sent to client
                }
               
               
                    
    })
})
app.post("/investorpro",function(req,resp){
    var email=req.body.txtEmail;
    var name=req.body.txtname;
    var cn=req.body.txtcontact;
    var ad=req.body.txtAddress;
    var city=req.body.txtcity;
    var com=req.body.txtcompany;
    var site=req.body.txtsite;
    var picName= req.files.profilepic.name;
    var idproofn=req.files.idproof.name;


        var des=__dirname+"/public/uploads/"+picName;
        //saving file in folder
        req.files.profilepic.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var des=__dirname+"/public/uploads/"+idproofn;
        //saving file in folder
        req.files.idproof.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var arry=[email,name,cn,ad,city,com,site,picName,idproofn];
        dbcontrol.query("insert into investor values(?,?,?,?,?,?,?,?,?)",arry, function(err){
            if(err){
                resp.send(err.toString());
            }
            else{
                resp.send("succesfull");
            }
        
        });





})
app.post("/investor-update",function(req,resp)
{
    console.log(req.body);
    //resp.send(req.body);
    var email=req.body.txtEmail;
    var name=req.body.txtname;
    var cn=req.body.txtcontact;
    var ad=req.body.txtAddress;
    var city=req.body.txtcity;
    var com=req.body.txtcompany;
    var site=req.body.txtsite;
    var picName= req.files.profilepic.name;
    var idproofn=req.files.idproof.name;


        var des=__dirname+"/public/uploads/"+picName;
        //saving file in folder
        req.files.profilepic.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var des=__dirname+"/public/uploads/"+idproofn;
        //saving file in folder
        req.files.idproof.mv(des,function(err)
        {
                if(err)
                    console.log(err);
                else
                    console.log("File Uploaded Successfully");
        });
        var ary=[email,name,cn,ad,city,com,site,picName,idproofn];
    
        dbcontrol.query("update investor set  name=?, contactno=?,address=?,city=?,companyname=?,site=?,idproof=?,profilepic=? where email=?",ary,function(err){
                if(err)
                    resp.send(err);
                    else
                    resp.send("Record Updated Successfulllyyyy");
        })
       

})

 //------------DELETE------------

app.post("/investor-delete",function(req,resp){
    var email=req.body.txtEmail;
    dbcontrol.query("delete from investor where email=?",[email],function(err,result)
    {
            if(err)
                resp.send(err);
                else
                if(result.affectedRows==0)
                    resp.send("Invalid Email id");
                    else
                    resp.send("Record Deleted....");
                    
    })
} )
//----------------------
app.get("/AJAXChekinvEmail",function(req,resp)
{
    var em=req.query.emailidKuch;
    dbcontrol.query("select * from investor where email=?",[em],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
            if(result.length==0)
                 resp.send("Available");
                 else
                 resp.send("Already Taken");
               
                    
    })
})
//====================
app.get("/jsonFechRecord",function(req,resp)
{
    var em=req.query.emailidKuch;
    dbcontrol.query("select * from investor where email=?",[em],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
                {
                    console.log(result)            ;
                 resp.send(result);//json array sent to     
                }
               
                    
    })
})
app.get("/AJAXCheksetEmail",function(req,resp)
{
    var em=req.query.emailidKuch;
    var passw=req.query.pass;
    var np=req.query.newp;
    dbcontrol.query("update train set pass=? where email=? and pass=?",[em,passw,np],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
                {
                    console.log(result)            ;
                 resp.send(result);//json array sent to client
                }
               
               
                    
    })
})
app.post("/pass-update",function(req,resp)
{
    console.log(req.body);
    //resp.send(req.body);
    var email=req.body.Email;
    var passw=req.body.inputPassword;
    var np=req.body.inputNPassword;
  
    ary=[email,passw,np];
        dbcontrol.query("update train set pass=? where email=? and pass=?",ary,function(err){
                if(err)
                    resp.send(err);
                    else
                    resp.send("Record Updated Successfulllyyyy");
        })
       

})
app.post("/ideapro",function(req,resp){
    var email=req.body.txtEmail;
    var category=req.body.category;
    var idt=req.body.ititle;
    var help=req.body.work;
    var pi=req.body.income;
    var fr=req.body.yesno;
    var date=req.body.sdate;
    var ir= req.body.investment;
    var np=req.body.partners;
    var inf=req.body.info;


     
        var arry=[email,category,idt,help,pi,fr,date,ir,np,inf];
        dbcontrol.query("insert into ideas values(?,?,?,?,?,?,?,?,?,?)",arry, function(err){
            if(err){
                resp.send(err.toString());
            }
            else{
                resp.send("succesfull");
            }
        
        });



    })
    
app.get("/adminpanel",function(req,resp){
    var fullPath=__dirname+"/public/adminpanel.html";
    resp.sendFile(fullPath);
})
app.get("/jsonFetchRecord",function(req,resp)
{
    var em=req.query.emailidKuch;
    dbcontrol.query("select * from pitcher",[em],function(err,result)
    {
        if(err)
            resp.send(err.toString());
        else
                {
                    console.log(result)            ;
                 resp.send(result);//json array sent to client
                }
                    
    })
    app.get("/ajax-delete",function(req,resp){
        var email=req.query.email;
        dbcontrol.query("delete from pitcher where email=?",[email],function(err,result)
    {
            if(err)
                resp.send(err);
                else
                if(result.affectedRows==0)
                    resp.send("Invalid Email id");
                    else
                    resp.send("Record Deleted....");
                    
    })

})
})
app.get("/jsonFechTitle",function(req,resp){
    var ca=req.query.category;
    dbcontrol.query("select title from ideas where category=?",[ca],function(err,result){
        if(err)
        resp.send(err);

        else{
            console.log(result);
            resp.send(result);
        }
    })
})
app.get("/jsonFechDet",function(req,resp){
    var ca=req.query.category;
    var ti=req.query.title;

    var ary=[ca,ti];

    dbcontrol.query("select *  from ideas where category=? and title=?",ary,function(err,result){
        if(err)
        resp.send(err);

        else{
            console.log(result);
            resp.send(result);
        }
    })
})

app.get("/jsonFechCate",function(req,resp){
    var ca=req.query.category;
    dbcontrol.query("select distinct category from ideas",[ca],function(err,result){
        if(err)
            resp.send(err);
        else{
            console.log(result);
            resp.send(result);
        }
    })
})
app.get("/jsonFechAll",function(req,resp){
    var ca=req.query.category;
    dbcontrol.query("select * from ideas where category=?",[ca],function(err,result){
        if(err)
            resp.send(err);
        else{
            console.log(result);
            resp.send(result);
        }
    })
})
app.get("/jsonFetchPitcher",function(req,resp){
    var em=req.query.email;
    dbcontrol.query("select * from pitcher where email=?",[em],function(err,result){
        if(err)
            resp.send(err);
        else{
            console.log(result);
            resp.send(result);
        }
    })







})


