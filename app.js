var express = require('express');
var app = express();
const bodyParser = require('body-parser');
        const RPC = require('discord-rpc')
        const client = new RPC.Client({ transport: 'ipc' })
        const activity = {}
        const assets = {}
const fetch = require('node-fetch');

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/chillwav', (req, res) => {
    //console.log('it works');
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
        const fetch = require('node-fetch');
               
               async function loadFileAndDoStuff(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data[0].now_playing.song.title + " Is the name of the song!");
        console.log(data[0].now_playing.song.artist + " Is the name of the artist!")
        //console.log(data[0].now_playing.streamer)
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
            //activity.type = 2;
            //activity.type = 2;
            client.on('ready', () => {
                client.request('SET_ACTIVITY', {
                    pid: process.pid,
                    activity: activity   
            })});
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
app.post('/custom', (req, res) => {
    console.log('Got body from custom: ', req.body);
            activity.state = req.body.sl;
            activity.details = req.body.fl;
            assets.large_image = req.body.li;
            assets.small_image = req.body.si;
            //activity.type = 2;
            //activity.type = 2;
            if (req.body.btncnt == '1') {
              activity.buttons = [
            {
              "label": res.body.btn1txt,
              "url": res.body.btn1url
            }
          ];
            }
            else if (req.body.btncnt == '2') {
              activity.buttons = [
            {
              "label": res.body.btn1txt,
              "url": res.body.btn1url
            },
            {
              "label": res.body.btn2txt,
              "url": res.body.btn2url
            }
                 
          ];
            } else if (req.body.btncnt > 2) {
                console.log('We all wish Discord supported more than 2 buttons. I have set the button count to 0.')
            } else if (isNaN(req.body.btncnt)) {
               console.log(req.body.btncnt + ' doesnt appear to be a number. I have set the button count to 0.') 
            } 
            client.on('ready', () => {
                client.request('SET_ACTIVITY', {
                    pid: process.pid,
                    activity: activity   
            })});
            console.log('Presence Sent')
            client.login({ clientId: req.body.ID })
    console.log('status set')
    res.sendStatus(200);
});
app.listen(80);
console.log('Listening on port: 80\n©' + new Date().getFullYear() + 'NeonDevelopment, SkepSickomode');
