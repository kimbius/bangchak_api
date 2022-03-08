const axios = require("axios");
const cheerio = require("cheerio");

async function get_lastest_oil(params) {
    const raw_html = await axios.get("https://www.bangchak.co.th/api/oilprice");
    const $ = cheerio.load(raw_html.data);

    let priceData = []

    $("body > header > item").each((i, e) => {
        const element = $(e)
        const get_value = (_) => element.find(_).text()
        priceData.push({
            type: get_value('type'),
            price: {
                today: Number(get_value('today')),
                tomorrow: Number(get_value('tomorrow')),
                yesterday: Number(get_value('yesterday')),
            },
            img: element.html().split("<img>")[1].split('<image2>')[0],
            img2: get_value('image2'),
            unit: {
                th: get_value('unit_th'),
                en: get_value('unit_en'),
            }
        })
    })

    return {
        title: $("body > header > title").text(),
        description: $("body > header > description").text(),
        copyright: $("body > header > copyright").text(),
        updateAt: new Date($("body > header > update_date").text()).getTime(),
        remark: {
            en: $("body > header > remark_en").text(),
            th: $("body > header > remark_th").text(),
        },
        priceData
    }
}

(async() => {
    console.log(await get_lastest_oil());
})()