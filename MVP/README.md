# Structure 
Every file follows this convention.

```
|- MockInput
|- MockOutput
|- Function declartion
|- Function call
|- Export
```

- MockInput describes what script takes as an Input
- MockOutput describes what script gives as an Output
- Function declartion is main function/class
- Function call allows to run each script seperatly.(Its comment out to allow clean export)
- Export exports the main function/class
- The output of a script follows this convention.

```
> node ./exampleScript
>> {InputParamsA: "A", InputParamsB: "B"}
>> ... nameOfFunction() ...
>> {OutputParmsA: "A", OutputParamsB: "b"}
```

# What it does?
Each file has a Isolated Usage. *alias Do one thing, do it well*

... Work in Progess ...

### Usage
0. `node --version`  -> Version 18
1. `node ./01-getData.js`
2. `node ./02-createMarket.js`
3. `node ./03-postComment.js`
4. `node ./main.js`
5. Realise that the output === input
6. `cat ./main.js`
7. Realise that the order of the function calls. 1.`getData()`, 2.`createMarket()`, 3.`postComment()`
8. `cat ./01-getData.js`
9. realise the structure 1. mocks, 2. function declartion, 3. function call, 4. export
10. `cat ./02-createMarket.js`
11. realise the structure 1. mocks, 2. function declartion, 3. function call, 4. export
12. `cat ./03-postComment.js`
13. realise the structure 1. mocks, 2. function declartion, 3. function call, 4. export

### Tasks

- [ ] make a super Alpha video, ask Tom. 
- [x] sit down with Gunjan and implent postComment()
- [x] sit down with Serge and try to create a market()
- [ ] sit down with me and implent getData()
- [ ] Fill out the form
- [ ] make everything super nicey.

... more will follow
