# switch-pin
This is an API for the Raspberry Pi in node.js that turns GPIO pins on and off remotely. It uses a REST format for requests:

For example, to get the status of all pins, send a get request to:
   www.yourdomain.com/api/pins/

For a specific pin, add it to the end of the url:
   www.yourdomain.com/api/pins/17

To switch that pin on, send a put request to that url with a json body:
   {state:"1", secret:"abcdef"}

The response will follow this json format:
   {"pins":[{"pin":17,"label":"lights","state":1}]}

# security

When first opening the page, it will ask for a password. That will then be checked with the config file, and the secret token will then be passed back and forth for authentication. It does not currently support https.

# logging

All requests are logged and visible at this url:
   www.yourdomain.com/log

