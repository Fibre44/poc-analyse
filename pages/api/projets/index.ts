import type { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoDb } from '../../../utils/connectMongoDb';
type Data = {
    error?: string,
    succes?: string,
    projet?: object
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
        const { client, date } = req.body
        const clientMongoDB = await connectMongoDb();
        console.log(req.body)
        if (req.method === 'POST') {
            const newProjet: Projet = {
                client,
                date
            }
            console.log(newProjet)
            const db = clientMongoDB.db();
            await db
                .collection('projets')
                .insertOne(newProjet);
            clientMongoDB.close();
            res.status(200).json({ succes: 'Création du projets' })


        } else {
            res.status(400).json({ error: "Vous ne pouvez que poster" })
        }
    } catch (e) {
        return res.status(500).json({ error: 'Erreur de connexion à la base de données' })
    }



}
