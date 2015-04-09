# switch-pin

This is an API for the Raspberry Pi that turns GPIO pins on and off remotely. It is written in node.js and uses a REST format for requests. To get the status of all gpio pins, send a get request to:

    www.yourdomain.com/api/pins/

For a specific gpio pin, add it to the end of the url:

    www.yourdomain.com/api/pins/17

To switch that gpio pin on, send a put request to the same url with a json body like this:

    {
      "state": "1",
      "secret": "your_secret_string_here"
    }

The response will follow this json format:

    {
      "pins": [
        {
          "pin": 17,
          "label": "lights",
          "state": 1
        },
        {
          "pin": 18,
          "label": "stereo",
          "state": 0
        }
      ]
    }

## security

Use your own interface or [my switch-pins-web interface](https://github.com/stephengreenfield/switch-pin-web). Upon first loading, it will prompt for a password, which is sent to:

    www.yourdomain.com/api/password/

with a body that looks like this:

    {
      "password": "yourpassword"
    }

The server will check that against the password value in your config.js file. If it matches, the secret value in config.js will be sent back to your client to be stores as a cookie with a response like this:

    {
      "secret": "whateveryoursecretis"
    }

This token is expected by the server for all status or switch requests. It does not currently support https protocol.

## logging

All requests are logged and visible at this url:

    www.yourdomain.com/log