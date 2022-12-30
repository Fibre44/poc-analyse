import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoDb } from '../../../utils/connectMongoDb';
type Data = {
    error?: string,
    succes?: string,
    client?: object
}
type Projet = {
    client: string,
    date: Date
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const clientMongoDB = await connectMongoDb();
        if (req.method === 'PUT') {
            const db = clientMongoDB.db();
            const society = await db.collection('Society').findOne({ siren: req.body.siren })
            if (society) {
                const updateSociety = {
                    client: society.client,
                    ...req.body
                }
                await db
                    .collection('Society')
                    .updateOne({ _id: new ObjectId(society._id) }, { $set: { ...updateSociety } });
                clientMongoDB.close();
                res.status(200).json({ succes: 'Mise à jour de la société', client: society.client })
            } else {
                clientMongoDB.close();
                res.status(404).json({ error: "La société n'existe pas" })
            }



        } else {
            res.status(400).json({ error: "Vous ne pouvez que poster" })
        }
    } catch (e) {
        return res.status(500).json({ error: 'Erreur de connexion à la base de données' })
    }



}
