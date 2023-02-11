import fetch from 'node-fetch'

const Polkassembly = class  {
    constructor() {
        this.comment = "comment"
        this.token = null
        this.URL = "https://polkadot.polkassembly.io/v1/graphql"
        this.user = ""
        this.password = ""
    }

    async set_token () {
        try {
            let login_res = await  fetch(this.URL, {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                  "content-type": "application/json",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "Referer": "https://polkadot.polkassembly.io/login",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": "{\"operationName\":\"LOGIN\",\"variables\":{\"password\":\""+this.password+"\",\"username\":\""+this.user+"\"},\"query\":\"mutation LOGIN($password: String!, $username: String!) {\\n  login(password: $password, username: $username) {\\n    token\\n    __typename\\n  }\\n}\"}",
                "method": "POST"
              });

            let j = await login_res.json();
            this.token = j.data.login.token
            return true
            // let postid=1596
        } catch (error) {
            console.log(error)
            return false
        }
    }


    async post(post_id,comment) {
        try {
        //login
        if (await this.set_token()) {
            let postid=post_id
            let post_res = await fetch(this.URL, {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                  "authorization": "Bearer "+ this.token,
                  "content-type": "application/json",
                  "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                  "sec-ch-ua-mobile": "?1",
                  "sec-ch-ua-platform": "\"Android\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "cookie": "refresh_token=adb6c5e9-01cf-4a09-8f5b-04526fd63de6",
                  "Referer": "https://polkadot.polkassembly.io/post/1596",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": "{\"operationName\":\"AddPostComment\",\"variables\":{\"authorId\":3004,\"content\":\""+comment +"\",\"postId\":"+ postid +"},\"query\":\"mutation AddPostComment($authorId: Int!, $content: String!, $postId: Int!) {\\n  __typename\\n  insert_comments(\\n    objects: {author_id: $authorId, content: $content, post_id: $postId}\\n  ) {\\n    affected_rows\\n    __typename\\n  }\\n}\"}",
                "method": "POST"
              });

            //logout
            await this.logout()
            return true

        }else {
            console.log('some error in system')
            return false
        }
        //
        
        } catch (error) {
            console.log(error)
            return false
            
        }
    }

    async logout() {
        try {
            let res = await fetch(this.URL, {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                  "authorization": "Bearer "+ this.token,
                  "content-type": "application/json",
                  "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                  "sec-ch-ua-mobile": "?1",
                  "sec-ch-ua-platform": "\"Android\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "cookie": "refresh_token=adb6c5e9-01cf-4a09-8f5b-04526fd63de6",
                  "Referer": "https://polkadot.polkassembly.io/",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": "{\"operationName\":\"LOGOUT\",\"variables\":{},\"query\":\"mutation LOGOUT {\\n  logout {\\n    message\\n    __typename\\n  }\\n}\"}",
                "method": "POST"
              });
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}


let p = new Polkassembly()
console.log(await p.post("1596","sweet comment 123"))