import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import BlogsDAO from './dao/blogsDAO.js';
import CommentsDAO from './dao/commentsDAO.js'

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(process.env.BLOG_DB_URI);
    const port = process.env.PORT || 8000;

    try {
        await client.connect();
        await BlogsDAO.injectDB(client);
        await CommentsDAO.injectDB(client);
        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);