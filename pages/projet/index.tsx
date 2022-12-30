import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import { connectMongoDb } from '../../utils/connectMongoDb';
import Link from 'next/link';
import { ProjetCard } from '../../components/projets/ProjetCard';

type Props = {
    projets: Projet[]
}

type Projet = {
    _id: string,
    client: string,
    date: Date
}

export default function Projets(props: Props) {
    return <div className="container">
        <h1>Projets</h1>
        <Link href="projet/add">
            Créer un nouveau projet
        </Link>
        {props.projets.length === 0 ?
            <p> Vous n &apos avez pas encore de projet</p>
            :
            props.projets.map(projet => <ProjetCard projet={projet} key={projet._id} />)}
    </div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });

    if (!session) {

        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        try {
            const client = await connectMongoDb()
            const db = client.db();
            // Récupérer les projets
            const projets = await db
                .collection('projets')
                .find()
                .sort({ dateDePublication: 'desc' })
                .toArray();
            return {
                props: {
                    projets: JSON.parse(JSON.stringify(projets)),
                },
            };
        } catch (e) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

    }

}
