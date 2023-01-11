import * as express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import Routes from "./routes"
import * as fileUpload from "express-fileupload";

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // upload file
    app.use(fileUpload());

    const port = 3000

    // API routes
    app.use('/', Routes);

    // setup express app here
    // ...

    // start express server
    app.listen(port)

    console.log(`App listening at http://localhost:${port}`)

}).catch(error => console.log(error))
