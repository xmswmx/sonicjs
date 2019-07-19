var pageBuilderService = require('./page-builder.service');
var formService = require('./form.service');

var fs = require('fs');
const cheerio = require('cheerio')
const axios = require('axios');
const ShortcodeTree = require('shortcode-tree').ShortcodeTree;
const chalk = require('chalk');
const log = console.log;

const apiUrl = 'http://localhost:3000/api/';
var pageContent = '';
var page;
var id;

module.exports = {

  

    getContent: async function (contentType) {
        const filter = encodeURI(`{"where":{"data.contentType":"${contentType}"}}`);
        let url = `${apiUrl}contents?filter=${filter}`;
        let page = await axios.get(url);
        return page.data;
    },

    getContentType: async function (contentType) {
        const filter = encodeURI(`{"where":{"systemid":"${contentType}"}}`);
        let url = `${apiUrl}contentTypes?filter=${filter}`;
        let contentTypeRecord = await axios.get(url);
        // console.log('contentTypeRecord.data', contentTypeRecord.data[0]);
        return contentTypeRecord.data[0];
    },

    getContentTopOne: async function (contentType) {
        let results = await this.getContent(contentType);
        return results[0].data;
    },

    getContentByUrl: async function (pageUrl, contentType) {
        const filter = `{"where":{"and":[{"url":"${pageUrl}"},{"data.contentType":"${contentType}"}]}}`;
        const encodedFilter = encodeURI(filter);
        let url = `${apiUrl}contents?filter=${encodedFilter}`;
        let pageRecord = await axios.get(url);
        if (pageRecord.data[0]) {
            return pageRecord;
            // await this.getPage(pageRecord.data[0].id, pageRecord.data[0]);
            // let page = pageRecord.data[0];
            // page.data.html = pageContent;
            // return page;
        }
        return 'not found';
    },

    getContentById: async function (id) {
        let url = `${apiUrl}contents/${id}`;
        let content = await axios.get(url);
        return content.data;
    },

    asyncForEach: async function (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    },

    getImageUrl: function (img) {
        return `/api/containers/container1/download/${img.originalName}`;
    },

    getImage: function (img) {
        let url = this.getImageUrl(img);
        return `<img class="img-fluid rounded" src="${url}" />`;
    }

}