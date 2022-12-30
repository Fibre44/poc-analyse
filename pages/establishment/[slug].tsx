import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import { connectMongoDb } from '../../utils/connectMongoDb';
import { Establishment } from '../../components/establishment/Establishment'

type Props = {
    establishment: Establishment
}
type Establishment = {
    _id: string,
    adress1: string,
    adress2: string | undefined,
    adress3: string | undefined,
    zipCode: string
    apen: string,
    city: string,
    nic: string,
    siren: string
}

export default function EstablishmentDetail(props: Props) {
    const establishment = props.establishment
    return <div className="container">
        <h1>Etablissement</h1>
        <Establishment key={establishment._id} establishment={establishment} />
    </div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });
    let { params } = context;
    let siret = params?.slug
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
            const siren = siret?.slice(0, 9)
            const nic = siret?.slice(9, 14)
            // Récupérer les projets
            const establishment = await db
                .collection('Establishment')
                .findOne({
                    siren,
                    nic
                })
            if (establishment) {
                return {
                    props: {
                        establishment: JSON.parse(JSON.stringify(establishment)),
                    },
                };
            } return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                },
            };

        } catch (e) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                },
            };
        }

    }

}
