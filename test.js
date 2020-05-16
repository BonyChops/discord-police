const test = async() => {
    const googleTTS = require('google-tts-api');
    let TTSUrl;
    await googleTTS('Hello World', 'en', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      TTSUrl = url;
    })
    console.log(TTSUrl);
}
test();