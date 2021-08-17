// Impprts

var express = require('express');

var app = express();

const bodyParser = require('body-parser');

const RPC = require('discord-rpc')

const client = new RPC.Client({ transport: 'ipc' })

const activity = {}

const assets = {}

const fetch = require('node-fetch');

// Set the view engine to ejs & add bodyparser

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Render Index Page

app.get('/', function(req, res) {
    res.render('index');
});

// ChillWav Preset

app.get('/chillwav', (req, res) => {
        assets.large_image = 'logo';
        assets.large_text = 'ChillWav Radio';
        activity.buttons = [
            {
              "label": "Website",
              "url": "https://chillwavradio.com"
            },
            {
              "label": "Discord",
              "url": "https://discord.gg/QcMG4EyrzM"
            }
        ];
        activity.assets = assets;

        async function loadFileAndDoStuff(url) {
                try {
                        const response = await fetch(url);
                        const data = await response.json();
                        console.log(data[0].now_playing.song.title + " Is the name of the song!");
                        console.log(data[0].now_playing.song.artist + " Is the name of the artist!")
                        var presenter = 'abc';
                        var myarr = data[0].now_playing.song.text.split("-");
                        var streamer = data[0].now_playing.streamer;
                        if (data[0].now_playing.streamer == "") {
                                console.log("Auto DJ")
                                var presenter = 'Otto'
                        } else {
                                console.log('Real DJ')
                                var presenter = data[0].now_playing.streamer
                        }
                        activity.state = `Presenter: ${presenter}`;
                        activity.details = `Song: ${myarr[1]}`;
                        client.on('ready', () => {
                                client.request('SET_ACTIVITY', {
                                        pid: process.pid,
                                        activity: activity
                        })
                });
                console.log('Presence Sent')
                client.login({ clientId: '826874981828132905' })

                console.log()
                var obj = JSON.stringify(data)

                } catch (err) {
                        console.error(err);
                }
        }
        setInterval(a => {
                loadFileAndDoStuff('https://radio.chillwavradio.com/api/nowplaying');
        }, 60000)
        console.log('status set')
        res.sendStatus(200);
});

// Custom Status

app.post('/custom', (req, res) => {
        console.log('Got body from custom: ', req.body);
        activity.state = req.body.sl;
        activity.details = req.body.fl;
        assets.large_image = req.body.li;
        assets.small_image = req.body.si;
        if (req.body.btncnt == '1') {
          activity.buttons = [
            {
              "label": req.body.btnatxt,
              "url": req.body.btnaurl
            }
          ];
            }
          else if (req.body.btncnt == '2') {
            activity.buttons = [
              {
                "label": req.body.btnatxt,
                "url": req.body.btnaurl
              },
              {
                "label": req.body.btnbtxt,
                "url": req.body.btnburl
              }

          ];
          } else if (req.body.btncnt > 2) {
              console.log('We all wish Discord supported more than 2 buttons. I have set the button count to 0.')
          } else if (isNaN(req.body.btncnt)) {
             console.log(req.body.btncnt + ' doesnt appear to be a number. I have set the button count to 0.')
          }
          activity.assets = assets;
          client.on('ready', () => {
                client.request('SET_ACTIVITY', {
                    pid: process.pid,
                    activity: activity
            })});
          console.log('Presence Sent')
          client.login({ clientId: req.body.ID })
          console.log('status set')
          res.render('response');
});

// Start the webserver on port 8080

app.listen(8080);

// Output the copyright and port to the console

console.log('Listening on port: 8080\n© ' + new Date().getFullYear() + ' NeonDevelopment, SkepSickomode');
