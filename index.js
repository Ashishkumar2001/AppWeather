const http = require('http');
const fs = require('fs');
const requests = require('requests');



const homeFile = fs.readFileSync("index.html", "utf-8", {"content-type":"text/html"});

const replaceVal = (tempVal, orgVal)=>{
    let temperature  = tempVal.replace("{%tempval%}", orgVal.main.temp);
        temperature  = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
        temperature  = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
        temperature  = temperature.replace("{%location%}", orgVal.name);
        temperature  = temperature.replace("{%country%}", orgVal.sys.country);
        temperature  = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
        return temperature;
};
    const server = http.createServer((req, res)=>{
        if(req.url=='/'){
            requests("https://api.openweathermap.org/data/2.5/weather?q=New%20Delhi&appid=9ba66f7f37651d73c9cfe9a13fcec394&units=metric"
            ).on("data", (chunk)=>{
                const objData = JSON.parse(chunk);
                const arrData = [objData];
              //  console.log(arrData[0].main.temp);
              const realTimeData = arrData.map((val)=>   replaceVal(homeFile, val)).join();
              res.write(realTimeData);
             
            })
            .on("end", (err)=>{
                if(err) return console.log("conection lost", err);
                res.end();
            });
        }
    });
    server.listen(3000, '0.0.0.0' ,()=>{
        console.log("server is running");
    });

