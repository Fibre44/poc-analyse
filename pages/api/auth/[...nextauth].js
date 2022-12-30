import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectMongoDb } from '../../../utils/connectMongoDb'

import { verifyPassword } from '../../../utils/bcrypt';

export default NextAuth({

    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (credentials) {
                    const { email, password } = credentials;
                    // Connexion à MongoDB
                    const clientMongoDB = await connectMongoDb();
                    const user = await clientMongoDB
                        .db()
                        .collection('users')
                        .findOne({ email: email });

                    if (!user) {
                        clientMongoDB.close();
                        throw new Error(
                            'Impossible de vous authentifier.',
                        );
                    }
                    // 2ème étape : le mot de passe est-il correct avec celui enregistré ?
                    const isValid = await verifyPassword(
                        password,
                        user.password,
                    );

                    if (!isValid) {
                        clientMongoDB.close();
                        throw new Error(
                            'Impossible de vous authentifier.',
                        );
                    }
                    return {
                        email: user.email,
                        fistname: user.fistname,
                        lastname: user.lastname,
                        id: user._id,
                        roles: user.roles,
                    };
                }

            },
        }),
    ]
});