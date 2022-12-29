import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { DsnParser } from "@fibre44/dsn-parser";
import { connectMongoDb } from './../../../../utils/connectMongoDb'

export const config = {
    api: {
        bodyParser: false,
    },
};



const insertMongoDb = async (datas) => {
    const clientMongoDB = await connectMongoDb();

    const db = clientMongoDB.db();
    const newDsnInfo = {
        ...datas.dsn
    }
    const newSociety = {
        ...datas.society
    }
    const newEstablishment = {
        ...datas.establishment
    }
    await db
        .collection('society')
        .insertOne(newSociety);
    await db
        .collection('Establishment')
        .insertOne(newEstablishment);
    await db
        .collection('dsn')
        .insertOne(newDsnInfo);

    clientMongoDB.close();

    return
}


const dsnParser = async (patch: string) => {
    const dsnParserOptions = {
        controleDsnVersion: true,
        deleteFile: true
    }
    const dsn = new DsnParser()
    await dsn.init(patch, dsnParserOptions)
    const dsnDatas = {
        dsn: dsn.dsn,
        society: dsn.society,
        establishment: dsn.establishment
    }
    return dsnDatas

}

const readFile = async (
    req: NextApiRequest,
    saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {

    const options: formidable.Options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/uploads");
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + "_" + path.originalFilename;
        };
    }
    options.maxFileSize = 4000 * 1024 * 1024;
    options.encoding = 'utf-8'
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

const handler: NextApiHandler = async (req, res) => {
    try {
        //Stockage du fichier
        await fs.readdir(path.join(process.cwd() + "/public", "/uploads"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"));
    }
    const fileInfo = await readFile(req, true);
    const patch = fileInfo.files.dsn.filepath
    const dsnDatas = await dsnParser(patch)
    await insertMongoDb(dsnDatas)
    res.json({ done: "ok" });
};

export default handler;