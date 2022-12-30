import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import { connectMongoDb } from '../../utils/connectMongoDb';
import { FormSociety } from '../../components/society/FormSociety';
type Props = {
    society: Society
}
type Society = {
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

export default function Societys(props: Props) {
    const society = props.society
    return <div className="container">
        <h1>Société</h1>
        <FormSociety key={society._id} society={society} />
    </div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });
    let { params } = context;
    const slug = params?.slug
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
            const society = await db
                .collection('Society')
                .findOne({ siren: slug })
            if (society) {
                return {
                    props: {
                        society: JSON.parse(JSON.stringify(society)),
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
