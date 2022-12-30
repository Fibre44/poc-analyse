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

type Datas = {
    dsn: {}
    society: {}
    establishment: {}
    assignement: {}
    at: {},
    classification: {},
    contributionFund: {},
    workContract: {}
}

const insertMongoDb = async (datas: Datas, client: string) => {
    const clientMongoDB = await connectMongoDb();

    const db = clientMongoDB.db();
    const newDsnInfo = {
        client,
        ...datas.dsn
    }
    const newSociety = {
        client,
        ...datas.society
    }
    const newEstablishment = {
        client,
        ...datas.establishment
    }
    const newAssignement = {
        client,
        ...datas.assignement
    }
    const contributionFund = {
        client,
        ...datas.contributionFund
    }
    await db
        .collection('Society')
        .insertOne(newSociety);
    await db
        .collection('Establishment')
        .insertOne(newEstablishment);
    await db
        .collection('Dsn')
        .insertOne(newDsnInfo);
    await db
        .collection('Assignement')
        .insertOne(newAssignement);
    await db
        .collection('ContributionFund')
        .insertOne(contributionFund);
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
        establishment: dsn.establishment,
        assignement: dsn.assignement,
        at: dsn.at,
        classification: dsn.classifications,
        contributionFund: dsn.contributionFund,
        workContract: dsn.workContract
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
    const file: any = fileInfo.files.dsn
    const patch = file.filepath
    const client = fileInfo.fields.client.toString()
    const dsnDatas = await dsnParser(patch)
    await insertMongoDb(dsnDatas, client)
    res.json({ message: "Import du fichier avec succès" });
};

export default handler;