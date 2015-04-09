var fs = require('fs');

exports.aim = {
                PASSWORD: 1,
                SECRET: 2,
                STATUS: 3,
                SWITCH: 4,
                UNKNOWN: 5
              };

exports.writeLog = function (message, isSwitch) {
  console.log(message);
  if (isSwitch) {
    fs.createWriteStream('log.switch',{'flags':'a'}).end(message);
  } else {
    fs.createWriteStream('log.status',{'flags':'a'}).end(message);
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
                      fs.readFileSync('log.switch','utf8') +
                    "</div> \
                     <br> \
                    <div class='green log'> \
                      status \
                    </div> \
                           \
                    <div class='black log'>" +
                      fs.readFileSync('log.status','utf8') +
                    "</div> \
                     <br> \
                  </div> \
                </body> \
              </html>";
  response.send(text);
};