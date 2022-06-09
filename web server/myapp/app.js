const express = require('express')
const http = require('http')
const app = express()
const port = 3000

app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","http://127.0.0.1:8080");
  
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
});
 

//路径
var path = require('path');
//图片上传
var multer  = require('multer');
 //mysql.js
 var mysql = require('mysql'); //调用MySQL模块

 //创建一个connection
 var connection = mysql.createConnection({
     host: '192.144.213.195',   //主机
     user: 'root',              //数据库用户名
     password: 'root',          //数据库密码
     port: '3310',       
     database: 'shq',           //数据库名称
     charset: 'UTF8_GENERAL_CI' //数据库编码
 });
 
 module.exports = connection  
 


/**
 *   展示图片
 */
app.get('/getimg', (req, res, next) => {
  let imgname     = req.query.imgname;
  let imgurl      = "./upload/"+imgname+".jpg";
  const filePath = path.resolve(__dirname, imgurl);
  // 给客户端返回一个文件流 type类型
  res.set( 'content-type', {"png": "image/png","jpg": "image/jpeg"} );//设置返回类型
  var stream = fs.createReadStream( filePath );
  var responseData = [];//存储文件流
  if (stream) {//判断状态
      stream.on( 'data', function( chunk ) {
        responseData.push( chunk );
      });
      stream.on( 'end', function() {
         var finalData = Buffer.concat( responseData );
         res.write( finalData );
         //res.end();
      });
  }
})

/**
 * 上传图片
 **/
var upload = multer({dest: 'upload_tmp/'});
var fs = require('fs');
app.post('/update', upload.any(), function(req, res, next) {
  console.log(req.files[0]);  // 上传的文件信息

  var des_file = "./upload/" + req.files[0].originalname;
      fs.readFile( req.files[0].path, function (err, data) {
      fs.writeFile(des_file, data, function (err) {
          if( err ){
              console.log( err );
          }else{
              response = {
                  message:'File uploaded successfully',
                  filename:req.files[0].originalname
              };
              console.log( response );
              res.end( JSON.stringify( response ) );
          }
      });
  });
});


/**
 * 注册接口
 */
app.get('/register', (req, res) => {
    let name     = req.query.name;
    let username = req.query.username;
    let password = req.query.password;

    //查询用户是否存在
    let sql1 = "SELECT *from user where username = '"+username +"' and password = '"+password+"'";
    connection.query(sql1, (err, rows, fields) => {
      if (err) throw err
      
      //this.length = rows.length;
      if(rows.length == 0){
        //写入数据库
        let sql = "insert into user value(null,'"+username+"','"+password+"','"+name+"','null',0)";

        connection.query(sql, (err, rows, fields) => {
          if (err) throw err
          //this.rese = "true";
          console.log("ok");
          res.send("true");
        }) 
      }else{
          res.send("false");
      }
    })  
})

/**
 * 登入接口
 */
app.get('/login', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
 
    let sql = "SELECT *from user where username = '"+username +"' and password = '"+password+"'";
    connection.query(sql, (err, rows, fields) => {
      if (err) throw err
    
      console.log('returna:', rows);
      res.send(rows);
    })     
})

/**
 * 添加博文
 */
 app.get('/upblog', (req, res) => {
  let userid  = req.query.userid;
  let title   = req.query.title;
  let article = req.query.article;
  let image   = req.query.image;

  let sql = "insert into article value(null,'"+userid+"','"+title+"','"+article+"','"+image+"')";
   connection.query(sql, (err, rows, fields) => {
    if (err) throw err
    res.send("true");
  })  
})

/**
 * 删除博文
 */
 app.get('/deblog', (req, res) => {
  let blogid  = req.query.id;

  let sql = "delete from article where id ="+blogid;
   connection.query(sql, (err, rows, fields) => {
    if (err) throw err
    res.send("true");
  })  
})


/**
 * 根据uid查询博文
 */
 app.get('/selectblogbyuserid', (req, res) => {
  let userid  = req.query.userid;

  let sql = "select *from article where userid ="+userid;
   connection.query(sql, (err, rows, fields) => {
    if (err) throw err
    res.send(rows);
  })  
})

/**
 * 查询所有博文
 */
 app.get('/selectblog', (req, res) => {
  let sql = "select *from article ";
   connection.query(sql, (err, rows, fields) => {
    if (err) throw err
    res.send(rows);
  })  
})

/**
 * 获取指定博文 by id
 */
 app.get('/selectblogbyid', (req, res) => {
   let aid = req.query.id;
   
  let sql = "select *from article where id ="+aid;
   connection.query(sql, (err, rows, fields) => {
    if (err) throw err
    res.send(rows);
  })  
})

/**
 * 修改博文
 */
 app.get('/updateblogbyid', (req, res) => {
  let aid = req.query.aid;
  let title   = req.query.title;
  let article = req.query.article;
  let image   = req.query.image;

 let sql = "update article set title = '"+title+"',article = '"+article+"',image='"+image+"'  where id ="+aid;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})


/**
 * 查询疫情表
 */
 app.get('/selectepidemicall', (req, res) => {
  let sql = "select *from epidemic";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send(rows);
 })  
})

/**
 * 写入疫情表
 */
 app.get('/insertepidemic', (req, res) => {
  let place     = req.query.place;
  let cumultive = req.query.cumultive;
  let exsiting  = req.query.exsiting;
  let newday    = req.query.newday;

  let sql = "insert into epidemic value(null,'"+place+"','"+cumultive+"','"+exsiting+"','"+newday+"')";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 删除疫情表
 */
 app.get('/deletedatainepidemicbyid', (req, res) => {
  let id     = req.query.id;
  let sql = "delete from epidemic where id ="+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})


/**
 * 修改疫情表
 */
 app.get('/updateinyiq', (req, res) => {
  
  let id     = req.query.id;
  let place     = req.query.place;
  let cumulative = req.query.cumulative;
  let existing  = req.query.ex;
  let newday    = req.query.newday;

  let sql = "update epidemic set place = '"+place+"',cumulative = "+cumulative+",existing = "+existing+",new_day="+newday+" where id = "+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 查询所有评论
 */
 app.get('/seletcomments', (req, res) => {
  let sql = "select *from  comments";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send(rows);
 })  
})


/**
 * 添加评论
 */
 app.get('/addpinglun', (req, res) => {
  let sql = "insert into comments value(null,'"+req.query.name+"',"+req.query.userid+","+req.query.blogid+","+req.query.text+")";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 查询博文下的评论
 */
 app.get('/selectpinglunatblog', (req, res) => {
  let blogid = req.query.blogid;
  let sql = "select *from comments where blog_id = "+blogid;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send(rows);
 })  
})

/**
 * 删除评论
 */
 app.get('/deletepingluna', (req, res) => {
  let id = req.query.id;
  let sql = "delete from comments where id = "+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 *  修改评论
 */
app.get('/updatepingluna', (req, res) => {
  let id   = req.query.id;
  let text = req.query.text;
  let sql  = "update comments set text ='" +text+"' where id ="+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})


/**
 * 查询所有用户
 */
 app.get('/selectAllOfUser', (req, res) => {
  let sql = "select *from user";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send(rows);
 })  
})

/**
 * 查询咨询
 */
 app.get('/selectcosulting', (req, res) => {
 
  let sql = "select *from consulting";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send(rows);
 })  
})


/**
 * 添加咨询
 */
app.get('/addcosulting', (req, res) => {
  let title =  req.query.title;
  let text  =  req.query.text;
  let sql = "insert into consulting value(null,'"+title+"','"+text+"')";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 删除
 */
 app.get('/deletecosulting', (req, res) => {
  let id = req.query.id;
  let sql = "delete from consulting where id = "+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 修改咨询
 */
 app.get('/updatecousulting', (req, res) => {
  let id = req.query.id;
  let title =  req.query.title;
  let text  =  req.query.text;
  let sql = "update consulting set title = '"+title+"',text = '"+text+"' where id = "+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 添加咨询评论
 */
 app.get('/addcoscomments', (req, res) => {
  let cid = req.query.cid;
  let text= req.query.text;
  
  let sql = "insert into Consulting_the_message value(null,'"+cid+"','"+text+"')";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })  
})

/**
 * 删除咨询评论 通过 id
 */
 app.get('/deletecoscomments', (req, res) => {
  let id = req.query.id; 
  let sql = "delete from Consulting_the_message where id ="+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })   
})

/**
 * 删除咨询评论 通过 id
 */
 app.get('/updatecoscomments', (req, res) => {
  let id = req.query.id; 
  let text= req.query.text;
  let sql = "update Consulting_the_message set text = '"+text+"' where id ="+id;
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })   
})

/**
 * 删除用户接口 通过username
 */
 app.get('/deletebyusername', (req, res) => {
  let username = req.query.username; 
  let sql = "delete from user where username = '"+username+"'";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })   
})

//修改用户info
app.get('/updateuserinforbyusername', (req, res) => {
  let username = req.query.username; 
  let name = req.query.name; 
  let password = req.query.password; 
  let sql = "update user set name = '"+name+"',password = '"+password+"' where username = '"+username+"'";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send("true");
 })   
})

 
/**
 * 通过username查询用户信息 
 */
 app.get('/selecttheuserbyusername', (req, res) => {
  let username = req.query.username; 
  let sql = "select * from user where username = '"+username+"'";
  connection.query(sql, (err, rows, fields) => {
   if (err) throw err
   res.send(rows);
 })   
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



 