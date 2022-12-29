// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoDb } from './../../utils/connectMongoDb'
import { hashPassword } from './../../utils/bcrypt'
type Data = {
    error?: string,
    succes?: string,
    user?: object
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { email, password, firstname, lastname, picture } = req.body
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ error: 'Le body de la requete est incomplet' })
    }

    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Mauvaise méthode' })
    }
    let clientMongoDB;
    try {
        clientMongoDB = await connectMongoDb();

    } catch (e) {
        return res.status(500).json({ error: 'Erreur de connexion à la base de données' })
    }
    const db = clientMongoDB.db();

    if (!email) {
        return res.status(400).json({ error: 'Le champ email est obligatoire' })
    }
    let findEmail;
    try {
        findEmail = await db
            .collection('users')
            .findOne({ email: email });
    } catch (e) {

    }
    if (findEmail) {
        clientMongoDB.close();
        return res.status(403).json({ error: 'Votre adresse existe déjà' })
    } else {
        //Verification du format de l'email
        const pattern =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!pattern.test(email)) {
            res.status(406).json({
                error: 'Votre adresse email est invalide.',
            });
            return
        }

        //hash du password
        const passwordHash = await hashPassword(password);

        try {
            const newUser = {
                firstname,
                lastname,
                email,
                password: passwordHash,
                picture,
                roles: [
                    'utilisateur'
                ],
                projets: []
            }
            await db
                .collection('users')
                .insertOne(newUser);
        } catch (error) {
            clientMongoDB.close();
            res.status(500).json({
                error: 'Un problème est survenu.',
            });
            return;
        }

        clientMongoDB.close();

        res.status(200).json({ succes: 'Création du compte' })
    }

}
