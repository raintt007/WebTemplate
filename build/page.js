const fs = require('fs');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const symbols = require('log-symbols');
const path = require('path');
const sd = require('silly-datetime');
const pagePath = path.join(__dirname, '../src/pages');
const time = sd.format(new Date(), 'YYYY/MM/DD HH:mm:ss');

process.on('exit', (code) => {
    let noticeStr = ''
    code === 0 ? noticeStr = '运行成功' : '运行失败'
    console.log(symbols.info, noticeStr);
});


const questions = [
    {
        type: 'input',
        name: 'name',
        message: '请输入页面名称（驼峰格式），例如example：',
        validate: val => {
            if (/^[a-zA-Z]+/.test(val)) {
                return true;
            }
            return "请输入英文（驼峰式）";
        }
    },
]

const htmlTemplate = 
`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/x-icon" href="./favicon.ico">
        <title>Document</title>
    </head>
    <body>
        <div class="{{name}}-wrapper">
            {{name}}
        </div>
    </body>
</html>
`
const jsEntryTemplate = `
import "./js/{{name}}.js"
import "./css/{{name}}.less"
`
const jsTemplate = ``
const lessTemplate = `
@import "@/common/css/common.css";
.{{name}}-wrapper {}`
const generateTemplate = (sourceType, data) => {
    let template,
        importStr;
    switch (sourceType) {
        case 'htmlTemplate':
            template = handlebars.compile(htmlTemplate);
            return template(data);
        case 'jsEntryTemplate':
            importStr = 
            "/**\n" +
            ` * @since ${data.time}\n` +
            " */\n" +
            "\n"
            importStr += jsEntryTemplate;
            template = handlebars.compile(importStr);
            return template(data);
        case 'jsTemplate':
            importStr =
            "/**\n" +
            ` * @since ${data.time}\n` +
            " */\n" +
            "\n"
            importStr += jsTemplate
            template = handlebars.compile(importStr);
            return template(data);
        case 'lessTemplate':
            template = handlebars.compile(lessTemplate);
            return template(data);
    }
}

const createProjectDir = (answers, folder = '') => {
    fs.mkdirSync(`${pagePath}/${answers.name}${folder}`, err => {
        if (err) {
            console.log(err)
            console.log(symbols.success, `pages/${answers.name}${folder} 目录创建失败`)
            process.exit(1)
        }
        console.log(symbols.success, `pages/${answers.name}${folder} 目录创建成功`)
    });
}

const createFile = (fileType, folder = '', answers) => {
    let extension = fileType,
        filename = answers.name
    if (fileType === 'jsEntry') {
        filename = 'index'
        extension = 'js'
    } else if (fileType === 'html') {
        filename = 'index'
    }
    fs.writeFileSync(`${pagePath}/${answers.name}${folder}/${filename}.${extension}`, generateTemplate(`${fileType}Template`, answers), err => {
        if (err) {
            console.log(err)
            console.log(symbols.success, `${filename}.${extension} 创建失败`)
            process.exit(1)
        }
        console.log(symbols.success, `${filename}.${extension} 创建成功`)
    });
}

inquirer.prompt(questions).then((answers) => {
    answers.time = time
    fs.access(`${pagePath}/${answers.name}`, err => {
        if (err) {
            createProjectDir(answers)
            createProjectDir(answers, '/js')
            createProjectDir(answers, '/css')
            createFile('jsEntry', '', answers)
            createFile('html', '', answers)
            createFile('js', '/js', answers)
            createFile('less', '/css', answers)
        } else {
            console.log(symbols.error, '存在同名项目，禁止替换')
            process.exit(0)
        }
    });
})