var mysql = require('mysql');  
      
var TEST_DATABASE = 'sakila';  
var TEST_TABLE = 'actorss';  
  
//创建连接  
var client = mysql.createConnection({  
  user: 'root',  
  password: 'admin',
  host: 'localhost'
});  

client.connect();
client.query("use " + TEST_DATABASE);

client.query(  
  "SELECT * FROM actorss where first_name = 'NICK'",  
  function selectCb(err, results, fields) {  
    if (err) {  
      throw err;  
    }  
      
      if(results)
      {
          for(var i = 0; i < results.length; i++)
          {
              console.log("%s\t%s\t%s", results[i].first_name, results[i].last_name, results[i].last_update);
          }
      }    
    client.end();  
  }  
);