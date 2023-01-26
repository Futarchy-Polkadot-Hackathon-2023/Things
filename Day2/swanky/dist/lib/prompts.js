"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickLanguage = exports.choice = exports.email = exports.name = exports.pickTemplate = void 0;
function pickTemplate(templateList) {
    if (!templateList || !templateList.length)
        throw new Error("Template list is empty!");
    return {
        name: "contractTemplate",
        type: "list",
        choices: templateList,
        message: "Which contract template should we use initially?",
    };
}
exports.pickTemplate = pickTemplate;
function name(subject, initial, questionText) {
    const question = {
        name: `${subject}Name`,
        type: "input",
        message: questionText || `What name should we use for ${subject}?`,
    };
    if (initial)
        question.default = initial;
    return question;
}
exports.name = name;
function email(initial, questionText) {
    const question = {
        name: "email",
        type: "input",
        message: questionText || "What is your email?",
    };
    if (initial)
        question.default = initial;
    return question;
}
exports.email = email;
function choice(subject, questionText) {
    return {
        name: subject,
        type: "confirm",
        message: questionText,
    };
}
exports.choice = choice;
function pickLanguage() {
    return {
        name: "contractLanguage",
        type: "list",
        choices: ["ink", "ask"],
        message: "Which contract language should we use?",
    };
}
exports.pickLanguage = pickLanguage;
