require('dotenv').config();
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

function removeEmoji(text) {
    let strCopy = text;
    const emojiKeycapRegex = /[\u0023-\u0039]\ufe0f?\u20e3/g;
    const emojiRegex = /\p{Extended_Pictographic}/gu;
    const emojiComponentRegex = /\p{Emoji_Component}/gu;
    if (emojiKeycapRegex.test(strCopy)) {
        strCopy = strCopy.replace(emojiKeycapRegex, '');
    }
    if (emojiRegex.test(strCopy)) {
        strCopy = strCopy.replace(emojiRegex, '');
    }
    if (emojiComponentRegex.test(strCopy)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const emoji of (strCopy.match(emojiComponentRegex) || [])) {
        if (/[\d|*|#]/.test(emoji)) {
            continue;
        }
        strCopy = strCopy.replace(emoji, '');
        }
    }

    return strCopy;
}

function removeUsername(text) {
    text = text.replace(/@[a-zA-Z0-9_]+/g, '');
    return text;
}

function removeUrl(text) {
    text = text.replace(/https?:\/\/\S+/g, '');
    return text;
}

function removeLine(text) {
    text = text.replace(/\r?\n|\r/g, '');
    return text;
}

function removeSpecialChar(text) {
    text = text.replace(/[^\w\s]/gi, '');
    return text;
}

function getSentiment (text) {
    return axios.post(process.env.EAI_ENDPOINT, {
        'document': {
            'text': text
        }
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.EAI_TOKEN,
        },
    })
    .then(function (response) {
        return response.data.data.sentiment
    })
    .catch(function (error) {
        console.log(error);
        return 'sad'
    });
}

function getIbmSentiment (text) {
    return axios.post(process.env.IBM_ENDPOINT + '/v1/analyze?version=2021-08-01', {
        'text': text,
        "features": {
            "entities": {
              "emotion": true,
              "sentiment": true,
              "limit": 2
            },
            "keywords": {
              "emotion": true,
              "sentiment": true,
              "limit": 2
            }
        },
    }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Basic ' + process.env.IBM_64
        },
    })
    .then(function (response) {
        return response.data
    })
    .then(function (data) {
        return {
            emotion: data.keywords[0].emotion,
            sentiment: data.keywords[0].sentiment
        }
    })
    .catch(function (error) {
        console.log(error);
        return 'sad'
    })
}

async function sentimentAnalysis(tweets) {
    return individual_sentiment = await Promise.all(tweets.map(async (tweet) => {
        var text = removeEmoji(tweet.text);
        text = removeUsername(text);
        text = removeUrl(text);
        text = removeLine(text);
        text = removeSpecialChar(text);
        return await getSentiment(text);
    }))
}

async function getAnalysis(username) {
    // OAuth 1.0a (User context)
    const userClient = new TwitterApi({
        appKey: process.env.consumer_key,
        appSecret: process.env.consumer_secret,
        accessToken: process.env.access_token,
        accessSecret: process.env.access_token_secret,
    });
    const jack = await userClient.v2.userByUsername(username);
    const tweetsOfJack = await userClient.v2.userTimeline(jack.data.id, {
        max_results: 50,
    });

    // tweetsOfJack.data.data gives you tweets
    const rate_list = await sentimentAnalysis(tweetsOfJack.data.data);
    var neg_count = 0;
    var pos_count = 0;
    var neu_count = 0;
    rate_list.forEach(function(rate) {
        if(rate.overall > 0)
            pos_count++;
        else if(rate.overall < 0)
            neg_count++;
        else
            neu_count++;
    })

    var complete_text = "";
    tweetsOfJack.data.data.forEach(function(tweet) {
        complete_text += tweet.text + " ";
    })
    complete_text = removeEmoji(complete_text);
    complete_text = removeUsername(complete_text);
    complete_text = removeUrl(complete_text);
    complete_text = removeLine(complete_text);
    complete_text = removeSpecialChar(complete_text);

    //overall_rating.overall
    var overall_rating = await getSentiment(complete_text.substring(0, 10240));
    const user_data = await userClient.v2.usersByUsernames(username, { 'user.fields': ['id', 'name', 'created_at', 'public_metrics' ]});
    // console.log({
	// 	username: username,
	// 	name: user_data.data[0].name,
	// 	joined: user_data.data[0].created_at,
	// 	public_metrics: user_data.data[0].public_metrics,
	// 	overall: overall_rating.overall,
	// 	positive: pos_count,
	// 	negative: neg_count,
	// 	neutral: neu_count
	// })
    return {
		username: username,
		name: user_data.data[0].name,
		joined: user_data.data[0].created_at,
		public_metrics: user_data.data[0].public_metrics,
		overall: overall_rating.overall,
		positive: pos_count,
		negative: neg_count,
		neutral: neu_count
	};
}
// getAnalysis('abhinavsri360')
// getIbmSentiment('I am so happy today!')

module.exports = {
    getAnalysis: getAnalysis
}
