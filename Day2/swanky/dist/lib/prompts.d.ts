import { Answers, ListQuestion, Question } from "inquirer";
export declare function pickTemplate(templateList: {
    message: string;
    value: string;
}[]): ListQuestion<Answers>;
export declare function name(subject: string, initial?: (answers: Answers) => string, questionText?: string): Question<Answers>;
export declare function email(initial?: string, questionText?: string): Question<Answers>;
export declare function choice(subject: string, questionText: string): Question<Answers>;
export declare function pickLanguage(): ListQuestion<Answers>;
