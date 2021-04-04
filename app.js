var express = require('express');
var app = express();
const bodyParser = require('body-parser');
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
                
                var presenter = data[0].now_playing.streamer
                console.log('Real DJ - ' + presenter)
            }
            const chillwav = require('discord-rich-presence')('826874981828132905');
            if (presenter == "Neon") {
                chillwav.updatePresence({
                    state: `Status: Currently Live`,
                    details: `Song: ${myarr[1]}`,
                    largeImageKey: `logo`,
                    //smallImageKey: 'snek_small',
                    instance: true
                });  
            } else {
                chillwav.updatePresence({
                    state: `DJ: ${presenter}`,
                    details: `Song: ${myarr[1]}`,
                    largeImageKey: `logo`,
                    //smallImageKey: 'snek_small',
                    instance: true
                });  
            }
         
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
    const custom = require('discord-rich-presence')(req.body.ID);
    custom.updatePresence({
        state: req.body.sl,
        details: req.body.fl,
        largeImageKey: req.body.li,
        smallImageKey: req.body.si,
        instance: true
    }); 
    console.log('status set')
    res.sendStatus(200);
});
app.listen(80);
console.log('Listening on port: 80');