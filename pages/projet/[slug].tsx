import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import Head from 'next/head';
import { connectMongoDb } from '../../utils/connectMongoDb';
import Field from '../../components/ui/Field';
import { useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Society } from '../../components/society/Society';
import { Establishment } from '../../components/establishment/Establishment';
import { useRouter } from 'next/router'

type Props = {
    projet: Projet,
    society: [Society]
    establishment: [Establishment]
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


type Projet = {
    client: string,
    date: Date
}

export default function Projet(props: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { client, date } = props.projet
    const societyList = props.society
    const establishmentList = props.establishment
    const form = useRef(null)
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (form.current) {
            const formData = new FormData(form.current)
            formData.append('client', client)
            const response = await fetch('/api/projets/dsn/uploadFile', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                router.reload()
                setLoading(false)
            }
        }
    }
    return (
        <>
            <Head>
                <title>{client}</title>
            </Head>
            <div className="container">

                <p>{client}</p>
                <form ref={form} onSubmit={handleSubmit} encType='multipart/form-data'>
                    <Field type="file" name="dsn" error={null}>
                        Fichier DSN
                    </Field>
                    <Button loading={loading}>Envoyer la dsn</Button>
                </form>
                <div>
                    {societyList ? societyList.map(society => <Society key={society._id} society={society} />) : <p>Pas de société</p>}
                </div>
                <div>
                    {establishmentList ? establishmentList.map(establishment => <Establishment key={establishment._id} establishment={establishment} />) : <p> Pas d &apos établissement</p>}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });
    let { params } = context;
    const slug = params?.slug;
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
            const projet = await db
                .collection('projets')
                .find({ client: slug })
                .toArray()
            //Réupérérer les sociétés
            const society = await db
                .collection('Society')
                .find({ client: slug })
                .toArray()
            const establishment = await db
                .collection('Establishment')
                .find({ client: slug })
                .toArray()
            const assignement = await db
                .collection('Assignement')
                .find({ client: slug })
                .toArray()
            return {
                props: {
                    projet: JSON.parse(JSON.stringify(projet[0])),
                    society: JSON.parse(JSON.stringify(society)),
                    establishment: JSON.parse(JSON.stringify(establishment)),
                    assignement: JSON.parse(JSON.stringify(assignement)),

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
