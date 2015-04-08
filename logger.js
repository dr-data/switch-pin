var fs = require('fs');

exports.writeLog = function (message, method) {
  console.log(message);
 if (method == "PUT") {
    fs.createWriteStream('put.log',{'flags':'a'}).end(message);
  } else {
    fs.createWriteStream('get.log',{'flags':'a'}).end(message);
  }
};

exports.showLog = function (response) {
  var text = "<html> \
                <head> \
                  <title>log</title> \
                  <link href='http://fonts.googleapis.com/css?family=Ubuntu+Mono:700' rel='stylesheet' type='text/css'> \
                  <link rel='stylesheet' type='text/css' href='http://mindsoon.com/s/styles.css'> \
                </head> \
                        \
                <body>  \
                  <div class='center-block'> \
                    <div class='green right log'> \
                      <br> \
                      successful [200]<br> \
                      invalid body [400]<br> \
                      invalid secret [401]<br> \
                      invalid password [402]<br> \
                      invalid ip address [403]<br> \
                      invalid resource [404]<br> \
                      invalid state [409]<br> \
                      cannot read gpio [500]<br> \
                      cannot write gpio [599]<br> \
                    </div> \
                    <br> \
                    <div class='green log'> \
                      switch \
                    </div> \
                           \
                    <div class='black log'>" +
                      fs.readFileSync('put.log','utf8') +
                    "</div> \
                     <br> \
                    <div class='green log'> \
                      status \
                    </div> \
                           \
                    <div class='black log'>" +
                      fs.readFileSync('get.log','utf8') +
                    "</div> \
                     <br> \
                  </div> \
                </body> \
              </html>";
  response.send(text);
};